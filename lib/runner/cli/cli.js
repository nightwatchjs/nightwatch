const path = require('path');
const TestSource = require('./test-source.js');
const Settings = require('../../settings/settings.js');
const Globals = require('../../settings/globals.js');
const Concurrency = require('../concurrency/concurrency.js');
const Utils = require('../../util/utils.js');
const Logger = require('../../util/logger.js');
const Runner = require('../runner.js');
const WebDriver = require('../webdriver-server.js');
const ProcessListener = require('../process-listener.js');

class CliRunner {
  static get CONFIG_JS_FILE() {
    return './nightwatch.conf.js';
  }

  constructor(argv = {}) {
    this.argv = argv;
    this.testRunner = null;
    this.globals = null;
    this.processListener = new ProcessListener();
  }

  initTestSettings(opts = {}, baseSettings = null, argv = null, testEnv = null) {
    this.test_settings = Settings.parse(opts, baseSettings, argv, testEnv);
    this.testSource = new TestSource(this.test_settings.src_folders, this.argv);

    this.setLoggingOptions();
    this.readExternalGlobals();

    return this;
  }

  readExternalGlobals() {
    if (this.test_settings.globals_path) {
      this.globals = new Globals(this.test_settings, this.testEnv);
      this.test_settings.globals = this.globals.mergeWithExisting();
    }

    return this;
  }

  /**
   * backwards compatibility
   * @readonly
   * @return {*}
   */
  get settings() {
    return this.baseSettings;
  }

  setCurrentTestEnv() {
    this.testEnv = typeof this.argv.env == 'string' ? this.argv.env : Settings.DEFAULT_ENV;
    this.testEnvArray = this.testEnv.split(',');

    this.availableTestEnvs = Object.keys(this.baseSettings.test_settings).map(key => {
      return typeof this.baseSettings.test_settings[key] == 'object' && this.baseSettings.test_settings[key];
    });

    this.validateTestEnvironments();

    return this;
  }

  setLoggingOptions() {
    Logger.setOutputEnabled(this.test_settings.output);
    Logger.setDetailedOutput(this.test_settings.detailed_output);

    if (this.test_settings.disable_colors) {
      Logger.disableColors();
    }

    if (this.test_settings.silent) {
      Logger.disable();
    } else {
      Logger.enable();
    }

    return this;
  }

  /**
   * @param {object} [settings]
   * @return {CliRunner}
   */
  setup(settings) {
    this.baseSettings = this.loadConfig();
    this.setCurrentTestEnv();
    this.parseTestSettings(settings);

    return this;
  }

  loadConfig() {
    const argvSetup = require('./argv-setup.js');

    // use default nightwatch.json file if we haven't received another value
    if (argvSetup.command('config').isDefault(this.argv.config)) {
      let defaultValue = argvSetup.command('config').defaults();
      let localJsValue = path.resolve(CliRunner.CONFIG_JS_FILE);

      if (Utils.fileExistsSync(localJsValue)) {
        this.argv.config = localJsValue;
      } else if (Utils.fileExistsSync(defaultValue)) {
        this.argv.config = path.join(path.resolve('./'), this.argv.config);
      } else {
        throw new Error('Missing nightwatch config file. Please make sure you have either nightwatch.json or nightwatch.conf.js defined in the current folder.')
      }
    } else {
      this.argv.config = path.resolve(this.argv.config);
    }

    return require(this.argv.config);
  }

  /**
   * Validates and parses the test settings
   * @param {object} [settings]
   * @returns {CliRunner}
   */
  parseTestSettings(settings = {}) {
    // checking if the env passed is valid
    if (this.baseSettings && !this.baseSettings.test_settings) {
      throw new Error('No testing environment defined in the configuration file.\n'+
        '  Please consult the docs at: http://nightwatchjs.org/gettingstarted#settings-file');
    }

    this.initTestSettings(settings, this.baseSettings, this.argv, this.testEnv);

    if (this.isWebDriverManaged()) {
      WebDriver.createInstances(this.baseSettings, this.argv, this.testEnvArray);
    }

    this.concurrency = new Concurrency(this.test_settings, this.argv);

    return this;
  }

  parallelMode() {
    return this.testEnvArray.length > 1 || this.test_settings.testWorkersEnabled && !this.testSource.isTestWorker();
  }

  runGlobalHook(key) {
    if (!Concurrency.isChildProcess() && this.test_settings.globals_path) {
      return this.globals.hooks[key].run();
    }

    return Promise.resolve();
  }

  validateTestEnvironments() {
    for (let i = 0; i < this.testEnvArray.length; i++) {
      if (!(this.testEnvArray[i] in this.baseSettings.test_settings)) {
        throw new Error(`Invalid testing environment specified: ${this.testEnvArray[i]}. Available environments are: ${this.availableTestEnvs.join(', ')}`);
      }
    }

    return this;
  }

  isWebDriverManaged() {
    return this.test_settings.webdriver.start_process && !Concurrency.isChildProcess();
  }

  startWebDriver() {
    if (!this.isWebDriverManaged()) {
      return Promise.resolve();
    }

    return WebDriver.startInstances().catch(err => {
      Logger.error(err.toString() + '\n');

      if (err.errorOut) {
        Logger.error(err.errorOut);
      }

      throw err;
    });
  }

  stopWebDriver() {
    if (!this.isWebDriverManaged()) {
      return Promise.resolve();
    }

    return WebDriver.stopInstances();
  }

  executeTestRunner(modules) {
    return this.testRunner.run(modules);
  }

  createTestRunner(testSource) {
    this.testRunner = Runner.create(testSource, this.test_settings, this.argv, {
      globalHooks: this.globals ? this.globals.hooks : null
    });

    this.processListener.setTestRunner(this.testRunner);

    return this;
  }

  /**
   *
   * @param [done]
   * @return {*}
   */
  runTests(done = null) {
    let testSource = this.testSource.getTestSource();

    this.createTestRunner(testSource);


    return this.runGlobalHook('before')
      .then(_ => {
        return Runner.readTestSource(testSource, this.test_settings);
      })
      .then(modules => {
        if (this.testRunner.supportsConcurrency && this.parallelMode()) {
          return this.testRunner.runConcurrent(this.testEnvArray, modules)
            .then(exitCode => {
              if (exitCode > 0) {
                this.processListener.setExitCode(exitCode);
              }
            });
        }

        return this.executeTestRunner(modules);
      })
      .catch(err => {
        Logger.error(err);

        if (err.data) {
          Logger.warn(' ' + err.data);
        }

        return err;
      })
      .then(errorOrFailed => {
        if (errorOrFailed instanceof Error || errorOrFailed === true) {
          this.processListener.setExitCode(5);
        }

        return this.runGlobalHook('after');
      })
      .catch(err => {
        Logger.error(err);
        console.log('');

        this.processListener.setExitCode(5);
      })
      .then(_ => {
        if (this.testRunner.supportsConcurrency && this.parallelMode() && Concurrency.isMasterProcess()) {
          this.testRunner.printGlobalResults();
        }

        if (typeof done == 'function' && !Concurrency.isChildProcess()) {
          return done();
        }
      });
  }
}

module.exports = CliRunner;
