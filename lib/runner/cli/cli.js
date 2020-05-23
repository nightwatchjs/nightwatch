const path = require('path');
const Settings = require('../../settings/settings.js');
const Globals = require('../../testsuite/globals.js');
const Concurrency = require('../concurrency/concurrency.js');
const Utils = require('../../utils');
const Runner = require('../runner.js');
const WebDriver = require('../webdriver-server.js');
const ProcessListener = require('../process-listener.js');
const {Logger} = Utils;

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

    if (argv.timeout) {
      const timeout = parseInt(argv.timeout, 10);
      if (!isNaN(timeout)) {
        this.test_settings.globals.waitForConditionTimeout = timeout;
        this.test_settings.globals.retryAssertionTimeout = timeout;
      }
    }

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
    Logger.setOptions(this.test_settings);

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
    if (argvSetup.isDefault('config', this.argv.config)) {
      let defaultValue = argvSetup.getDefault('config');
      let localJsValue = path.resolve(CliRunner.CONFIG_JS_FILE);
      let newConfigCreated = false;
      const hasJsConfig = Utils.fileExistsSync(localJsValue);
      const hasJsonConfig = Utils.fileExistsSync(defaultValue);

      if (!hasJsConfig && !hasJsonConfig) {
        newConfigCreated = CliRunner.createDefaultConfig(localJsValue);
      }

      if (hasJsConfig || newConfigCreated) {
        this.argv.config = localJsValue;
      } else if (hasJsonConfig) {
        this.argv.config = path.join(path.resolve('./'), this.argv.config);
      }
    } else {
      this.argv.config = path.resolve(this.argv.config);
    }

    return require(this.argv.config);
  }

  static createDefaultConfig(destFileName) {
    console.log(Logger.colors.cyan('No config file found in the current working directory, creating nightwatch.conf.js in the current folder...'));

    const templateFile = path.join(__dirname, 'nightwatch.conf.ejs');
    const os = require('os');
    const fs = require('fs');
    const ejs = require('ejs');

    const tplData = fs.readFileSync(templateFile).toString();

    let rendered = ejs.render(tplData, {
      isMacOS: os.platform() === 'darwin'
    });

    rendered = Utils.stripControlChars(rendered);
    try {
      fs.writeFileSync(destFileName, rendered, {encoding: 'utf-8'});

      return true;
    } catch(err) {
      Logger.error(`Failed to save nightwatch.conf.js config file to ${destFileName}. You need to manually create either a nightwatch.json or nightwatch.conf.js configuration file.`);
      Logger.error(err);

      return false;
    }

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

        console.log('');

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
