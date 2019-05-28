const path = require('path');
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
    this.testEnv = null;
    this.testEnvArray = [];
    this.processListener = new ProcessListener();
  }

  initTestSettings(opts = {}, baseSettings = null, argv = null, testEnv = null) {
    this.test_settings = Settings.parse(opts, baseSettings, argv, testEnv);

    this.setLoggingOptions();
    this.setupGlobalHooks();

    return this;
  }

  setupGlobalHooks() {
    this.globals = new Globals(this.test_settings, this.argv, this.testEnv);

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
    if (!this.argv.env) {
      return this;
    }

    this.testEnv = Utils.isString(this.argv.env) ? this.argv.env : Settings.DEFAULT_ENV;
    this.testEnvArray = this.testEnv.split(',');

    this.availableTestEnvs = Object.keys(this.baseSettings.test_settings).filter(key => {
      return Utils.isObject(this.baseSettings.test_settings[key]);
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
    this.validateConfig();
    this.setCurrentTestEnv();
    this.parseTestSettings(settings);
    this.createTestRunner();
    this.setupConcurrency();

    return this;
  }

  loadConfig() {
    if (!this.argv.config) {
      return null;
    }

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
        throw new Error('Missing nightwatch config file. Please make sure you have either nightwatch.json or nightwatch.conf.js defined in the current folder.');
      }
    } else {
      this.argv.config = path.resolve(this.argv.config);
    }

    return require(this.argv.config);
  }

  validateConfig() {
    // checking if the env passed is valid
    if (this.baseSettings && !this.baseSettings.test_settings) {
      throw new Error('No testing environment defined in the configuration file.\n'+
        '  Please consult the docs at: https://nightwatchjs.org/gettingstarted#settings-file');
    }

    return this;
  }

  /**
   * Validates and parses the test settings
   * @param {object} [settings]
   * @returns {CliRunner}
   */
  parseTestSettings(settings = {}) {
    this.initTestSettings(settings, this.baseSettings, this.argv, this.testEnv);

    return this;
  }

  runGlobalHook(key) {
    if (!Concurrency.isChildProcess()) {
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

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Concurrency related
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  get testWorkersMode() {
    return this.test_settings.testWorkersEnabled && !this.testRunner.isTestWorker();
  }

  parallelMode(modules = null) {
    if (this.testWorkersMode && Array.isArray(modules) && modules.length <= 1) {
      return false;
    }

    return this.testEnvArray.length > 1 || this.testWorkersMode;
  }

  setupConcurrency() {
    WebDriver.concurrencyEnabled = this.isConcurrencyEnabled();
    WebDriver.testWorkersMode = this.testWorkersMode;

    if (this.isWebDriverManaged()) {
      WebDriver.createInstances(this.baseSettings, this.argv, this.testEnvArray);
    }

    this.concurrency = new Concurrency(this.test_settings, this.argv);

    return this;
  }

  isWebDriverManaged() {
    return this.test_settings.webdriver.start_process && !Concurrency.isChildProcess();
  }

  isConcurrencyEnabled(modules) {
    if (!this.testRunner) {
      throw new Error('No test runner available.');
    }

    return this.testRunner.supportsConcurrency && this.parallelMode(modules);
  }

  startWebDriver() {
    if (!this.isWebDriverManaged()) {
      return Promise.resolve();
    }

    return WebDriver.startInstances().catch(err => {
      Logger.error(err);

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

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Test runner related
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  executeTestRunner(modules) {
    return this.testRunner.run(modules);
  }

  createTestRunner() {
    this.testRunner = Runner.create(this.test_settings, this.argv, {
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
    return this.runGlobalHook('before')
      .then(_ => {
        return Runner.readTestSource(this.test_settings, this.argv);
      })
      .then(modules => {
        if (this.isConcurrencyEnabled(modules)) {
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
        if (err.detailedErr) {
          err.data = err.detailedErr;
        }

        Logger.error(err);

        if (err.data) {
          Logger.warn(' ' + err.data);
        }

        return err;
      })
      .then(errorOrFailed => {
        if (errorOrFailed instanceof Error || errorOrFailed === true) {
          try {
            this.processListener.setExitCode(5);
          } catch (e) {
            console.error(e);
          }
        }

        return this.runGlobalHook('after')
          .then(result => {
            return errorOrFailed;
          });
      })
      .catch(err => {
        Logger.error(err);
        console.log('');

        try {
          this.processListener.setExitCode(5);
        } catch (e) {
          console.error(e);
        }

        return err;
      })
      .then(possibleError => {
        if (typeof done == 'function' && !Concurrency.isChildProcess()) {
          return done(possibleError);
        }

        if (possibleError instanceof Error) {
          throw possibleError;
        }
      });
  }
}

module.exports = CliRunner;
