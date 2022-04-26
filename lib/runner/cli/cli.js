const path = require('path');
const ArgvSetup = require('./argv-setup.js');
const Settings = require('../../settings/settings.js');
const Globals = require('../../testsuite/globals.js');
const Concurrency = require('../concurrency');
const Utils = require('../../utils');
const Runner = require('../runner.js');
const ProcessListener = require('../process-listener.js');
const {Logger, singleSourceFile} = Utils;

class CliRunner {
  static get CONFIG_FILE_JS() {
    return './nightwatch.conf.js';
  }

  static get CONFIG_FILE_CJS() {
    return './nightwatch.conf.cjs';
  }

  static createDefaultConfig(destFileName) {
    // eslint-disable-next-line no-console
    console.log(Logger.colors.cyan('No config file found in the current working directory, creating nightwatch.conf.js in the current folder...'));

    const templateFile = path.join(__dirname, 'nightwatch.conf.ejs');
    const os = require('os');
    const fs = require('fs');
    const ejs = require('@nightwatch/ejs');

    const tplData = fs.readFileSync(templateFile).toString();

    let launch_url = 'https://nightwatchjs.org';
    const availablePlugins = [];
    const autoLoadPlugins = [{
      'vite-plugin-nightwatch': {
        launch_url: 'http://localhost:3000'
      }
    }];

    autoLoadPlugins.forEach(plugin => {
      try {
        const pluginName = Object.keys(plugin)[0];
        const pluginPath = Utils.getPluginPath(pluginName);

        availablePlugins.push(pluginName);
        if (plugin[pluginName].launch_url) {
          launch_url = plugin[pluginName].launch_url;
        }
      } catch (err) {
        // plugin is not installed
      }
    });

    let rendered = ejs.render(tplData, {
      plugins: (availablePlugins.length > 0) ? JSON.stringify(availablePlugins) : '[]',
      launch_url,
      isMacOS: os.platform() === 'darwin'
    });

    rendered = Utils.stripControlChars(rendered);
    try {
      fs.writeFileSync(destFileName, rendered, {encoding: 'utf-8'});

      return true;
    } catch (err) {
      Logger.error(`Failed to save nightwatch.conf.js config file to ${destFileName}. You need to manually create either a nightwatch.json or nightwatch.conf.js configuration file.`);
      Logger.error(err);

      return false;
    }
  }

  constructor(argv = {}) {
    if (argv.source && !argv._source) {
      argv._source = argv.source;
      delete argv.source;
    }

    if (argv._source && Utils.isString(argv._source)) {
      argv._source = [argv._source];
    }

    this.argv = argv;

    this.testRunner = null;
    this.globals = null;
    this.testEnv = null;
    this.testEnvArray = [];
    this.processListener = new ProcessListener();
  }

  initTestSettings(userSettings = {}, baseSettings = null, argv = null, testEnv = '') {
    this.test_settings = Settings.parse(userSettings, baseSettings, argv, testEnv);

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
   * @deprecated
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
  async setupAsync(settings) {
    this.baseSettings = await this.loadConfig();
    this.commonSetup(settings);

    return this;
  }

  /**
   * Backwords compatibility for runner
   * @param {object} [settings]
   * @return {CliRunner}
   */
  setup(settings) {
    this.baseSettings = this.loadConfig();
    this.commonSetup(settings);

    return this;
  }

  commonSetup(settings) {
    this.validateConfig();
    this.setCurrentTestEnv();
    this.parseTestSettings(settings);

    this.createTestRunner();
    this.setupConcurrency();

    return this;
  }

  isConfigDefault(configFile, localJsValue = CliRunner.CONFIG_FILE_JS) {
    return ArgvSetup.isDefault('config', configFile) || path.resolve(configFile) === localJsValue;
  }

  getLocalConfigFileName() {
    let packageInfo;
    try {
      packageInfo = require(path.resolve('package.json'));
    } catch (err) {
      packageInfo = null;
    }

    packageInfo = packageInfo || {};
    const usingESM = packageInfo.type === 'module';

    return path.resolve(usingESM ? CliRunner.CONFIG_FILE_CJS : CliRunner.CONFIG_FILE_JS);
  }

  loadConfig() {
    if (!this.argv.config) {
      return null;
    }

    const localJsValue = this.getLocalConfigFileName();

    // use default nightwatch.json file if we haven't received another value
    if (this.isConfigDefault(this.argv.config, localJsValue)) {
      let newConfigCreated = false;
      const defaultValue = ArgvSetup.getDefault('config');
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

  validateConfig() {
    // checking if the env passed is valid
    if (this.baseSettings && !this.baseSettings.test_settings) {
      this.baseSettings.test_settings = {
        default: {}
      };
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
        const error = new Error(`Invalid testing environment specified: ${this.testEnvArray[i]}. \n\n ${Logger.colors.light_cyan('Available environments are:')}\n ${Logger.inspectObject(this.availableTestEnvs)}`);
        error.showTrace = false;
        throw error;
      }
    }

    return this;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Concurrency related
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  get testWorkersMode() {
    return this.isTestWorkersEnabled() && !this.testRunner.isTestWorker();
  }

  isTestWorkersEnabled() {
    return this.test_settings.testWorkersEnabled && !singleSourceFile(this.argv);
  }

  parallelMode(modules = null) {
    if (this.testWorkersMode && Array.isArray(modules) && modules.length <= 1) {
      return false;
    }

    return this.testEnvArray.length > 1 || this.testWorkersMode;
  }

  setupConcurrency() {
    this.concurrency = new Concurrency(this.test_settings, this.argv);

    return this;
  }

  isConcurrencyEnabled(modules) {
    return this.testRunner.supportsConcurrency && this.parallelMode(modules);
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
        if (!this.testRunner) {
          const error = new Error(`Test runner '${this.test_settings.test_runner.type}' is not known.`);
          error.showTrace = false;
          error.detailedErr = `\n Verify "test_runner" settings: \n  ${Logger.inspectObject(this.test_settings.test_runner)}`;

          throw error;
        }

        let promise = Promise.resolve();

        if (this.test_settings.selenium && this.test_settings.selenium.start_process) {
          const SeleniumServer = require('../../transport/selenium-webdriver/selenium.js');
          this.seleniumService = SeleniumServer.startServer(this.test_settings);
          promise = this.seleniumService.init();
          this.test_settings.selenium['[_started]'] = true;
        }

        return promise.then(() => {
          if (this.isConcurrencyEnabled(modules)) {
            return this.testRunner.runConcurrent(this.testEnvArray, modules)
              .then(exitCode => {
                if (exitCode > 0) {
                  this.processListener.setExitCode(exitCode);
                }
              });
          }

          return this.executeTestRunner(modules);
        });
      })
      .catch(err => {
        if (err.detailedErr) {
          err.data = err.detailedErr;
        }

        if (!err.sessionCreate && !err.displayed) {
          Logger.error(err);

          if (err.data) {
            Logger.warn(' ' + err.data);
          }

          // eslint-disable-next-line no-console
          console.log('');
        }

        err.displayed = true;

        return err;
      })
      .then(errorOrFailed => {
        if (this.seleniumService) {
          // stop the Selenium Server if running
          const {service} = this.seleniumService;
          if (service && service.kill) {
            // Give the selenium server some time to close down its browser drivers
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                service.kill()
                  .catch(err => {
                    Logger.error(err);
                  })
                  .then(() => this.seleniumService.stop())
                  .then(() => resolve());
              }, 100);
            }).then(() => {
              return errorOrFailed;
            });
          }
        }

        return errorOrFailed;
      })
      .then(errorOrFailed => {
        if (errorOrFailed instanceof Error || errorOrFailed === true) {
          try {
            this.processListener.setExitCode(5);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
          }
        }

        return this.runGlobalHook('after')
          .then(result => {
            return errorOrFailed;
          });
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log('');

        try {
          this.processListener.setExitCode(5);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }

        return err;
      })
      .then(errorOrFailed => {
        if (typeof done == 'function' && !Concurrency.isChildProcess()) {
          if (errorOrFailed instanceof Error) {
            return done(errorOrFailed);
          }

          return done();
        }

        if (errorOrFailed instanceof Error) {
          throw errorOrFailed;
        }

        return errorOrFailed;
      });
  }
}

module.exports = CliRunner;
