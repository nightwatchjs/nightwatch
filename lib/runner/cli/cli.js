const path = require('path');
const lodashClone = require('lodash.clone');
const ArgvSetup = require('./argv-setup.js');
const Settings = require('../../settings/settings.js');
const Globals = require('../../testsuite/globals.js');
const Factory = require('../../transport/factory.js');
const Concurrency = require('../concurrency');
const Utils = require('../../utils');
const Runner = require('../runner.js');
const ProcessListener = require('../process-listener.js');
const analyticsCollector = require('../../utils/analytics.js');
const {Logger, singleSourceFile, isSafari, isLocalhost} = Utils;
const NightwatchEvent = require('../eventHub.js');
const {NightwatchEventHub, DEFAULT_RUNNER_EVENTS} = NightwatchEvent;
const {GlobalHook} = DEFAULT_RUNNER_EVENTS;
const {RealIosDeviceIdError, iosRealDeviceUDID, isRealIos, isMobile, killSimulator} = require('../../utils/mobile.js');

class CliRunner {
  static get CONFIG_FILE_JS() {
    return './nightwatch.conf.js';
  }

  static get CONFIG_FILE_CJS() {
    return './nightwatch.conf.cjs';
  }

  static get CONFIG_FILE_TS() {
    return './nightwatch.conf.ts';
  }
 
  static createDefaultConfig(destFileName) {
    // eslint-disable-next-line no-console
    console.log(Logger.colors.cyan('No config file found in the current working directory, creating nightwatch.conf.js in the current folder...'));

    const templateFile = path.join(__dirname, 'nightwatch.conf.ejs');
    const os = require('os');
    const fs = require('fs');
    const ejs = require('ejs');

    const tplData = fs.readFileSync(templateFile).toString();

    let launch_url = 'https://nightwatchjs.org';
    const availablePlugins = [];
    const autoLoadPlugins = [{
      'vite-plugin-nightwatch': {
        launch_url: 'http://localhost:3000'
      }
    }, {
      '@nightwatch/storybook': {
        launch_url: 'http://localhost:6006'
      }
    }, {
      '@nightwatch/react': {}
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

    if (argv.firefox) {
      argv.e = argv.env = 'firefox';
    } else if (argv.chrome) {
      argv.e = argv.env = 'chrome';
    } else if (argv.safari) {
      argv.e = argv.env = 'safari';
    } else if (argv.edge) {
      argv.e = argv.env = 'edge';
    }

    this.argv = argv;

    this.testRunner = null;
    this.globals = null;
    this.testEnv = null;
    this.testEnvArray = [];
    this.processListener = new ProcessListener();
  }

  initTestSettings(userSettings = {}, baseSettings = null, argv = null, testEnv = '', asyncLoading) {
    this.test_settings = Settings.parse(userSettings, baseSettings, argv, testEnv);

    this.setLoggingOptions();
    this.setupGlobalHooks();

    const result = this.readExternalHooks(asyncLoading);

    if (result instanceof Promise) {
      return result.then(() => {
        this.globalsSetup(argv);
      });
    }

    this.globalsSetup(argv);
    this.setMobileOptions(argv);

    return this;
  }

  globalsSetup(argv) {
    this.globals.init();
    this.setTimeoutOptions(argv);
  }

  setTimeoutOptions(argv) {
    if (argv.timeout) {
      const timeout = parseInt(argv.timeout, 10);
      if (!isNaN(timeout)) {
        this.test_settings.globals.waitForConditionTimeout = timeout;
        this.test_settings.globals.retryAssertionTimeout = timeout;
      }
    }
  }
  
  setMobileOptions(argv) {
    const {desiredCapabilities} = this.test_settings;

    if (!isRealIos(desiredCapabilities)) {
      return;
    }

    if (argv.deviceId) {
      this.test_settings.desiredCapabilities['safari:deviceUDID'] = iosRealDeviceUDID(argv.deviceId);
    } else if (!desiredCapabilities['safari:deviceUDID']) {
      throw new RealIosDeviceIdError();
    }
  }

  setupGlobalHooks() {
    this.globals = new Globals(this.test_settings, this.argv, this.testEnv);
  }

  readExternalHooks(asyncLoading = true) {
    return this.globals.readExternal(asyncLoading);
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
    this.testEnv = Utils.isString(this.argv.env) ? this.argv.env : Settings.DEFAULT_ENV;
    this.testEnvArray = this.testEnv.split(',');

    if (!this.baseSettings) {
      return this;
    }  

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
    await this.commonSetup(settings);

    return this;
  }

  /**
   * Backwords compatibility for runner
   * @param {object} [settings]
   * @return {CliRunner}
   */
  setup(settings) {
    this.baseSettings = this.loadConfig();
    this.commonSetup(settings, false);

    return this;
  }

  commonSetup(settings, asyncLoading = true) {
    this.validateConfig();
    this.setCurrentTestEnv();

    const result = this.parseTestSettings(settings, asyncLoading);
    if (asyncLoading) {
      return result.then(() => this.runnerSetup());
    }

    this.runnerSetup();

    return this;
  }

  runnerSetup() {
    this.createTestRunner();
    this.setupConcurrency();
    this.loadTypescriptTranspiler();

    analyticsCollector.updateSettings(this.test_settings);
    analyticsCollector.updateLogger(Logger);

    analyticsCollector.event('nw_test_run', {
      arg_parallel: this.argv.parallel,
      browserName: this.test_settings.desiredCapabilities.browserName,
      testWorkersEnabled: this.test_settings.testWorkersEnabled,
      use_xpath: this.test_settings.use_xpath,
      isBstack: this.test_settings.desiredCapabilities['bstack:options'] !== undefined,
      test_runner: this.test_settings.test_runner ? this.test_settings.test_runner.type : null
    });

    this.setupEventHub();
  }

  isRegisterEventHandlersCallbackExistsInGlobal() {
    const {globals} = this.test_settings;
    const {plugins = []} = this.globals;
  
    return Utils.isFunction(globals.registerEventHandlers) || plugins.some(plugin => plugin.globals && Utils.isFunction(plugin.globals.registerEventHandlers));
  }

  setupEventHub() {
    if (this.isRegisterEventHandlersCallbackExistsInGlobal() && !NightwatchEventHub.isAvailable) {
      NightwatchEventHub.runner = this.testRunner.type;
      NightwatchEventHub.isAvailable = true;
      
      const {globals, output_folder} = this.test_settings;
      NightwatchEventHub.output_folder = output_folder;
      const {plugins} = this.globals;
  
      if (Utils.isFunction(globals.registerEventHandlers)) {
        globals.registerEventHandlers(NightwatchEventHub);
      }
  
      if (plugins.length > 0) {
        plugins.forEach((plugin) => {
          if (plugin.globals && Utils.isFunction(plugin.globals.registerEventHandlers)){
            plugin.globals.registerEventHandlers(NightwatchEventHub);
          }
        });
      }
    }
  }

  loadTypescriptTranspiler() {
    const isTypescriptProject = Utils.fileExistsSync(path.join(process.cwd(), 'tsconfig.json'));
    if (isTypescriptProject) {
      Logger.info('Now you can run TS tests directly using Nightwatch.');
    }

    const projectTsFilePath = Utils.findTSConfigFile(this.test_settings.tsconfig_path);
    if (projectTsFilePath !== '' && !this.test_settings.disable_typescript) {
      Utils.loadTSNode(projectTsFilePath);
    }
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

    const usingTS = Utils.fileExistsSync(CliRunner.CONFIG_FILE_TS);

    if (usingESM) {
      return path.resolve(CliRunner.CONFIG_FILE_CJS);
    }
    if (usingTS) {
      return path.resolve(CliRunner.CONFIG_FILE_TS);
    }
 
    return path.resolve(CliRunner.CONFIG_FILE_JS);
  }

  loadConfig() {
    if (!this.argv.config) {
      return null;
    }

    const localJsOrTsValue = this.getLocalConfigFileName();

    // use default nightwatch.json file if we haven't received another value
    if (this.isConfigDefault(this.argv.config, localJsOrTsValue)) {
      let newConfigCreated = false;
      const defaultValue = ArgvSetup.getDefault('config');
      const hasJsOrTsConfig = Utils.fileExistsSync(localJsOrTsValue);
      const hasJsonConfig = Utils.fileExistsSync(defaultValue);

      if (!hasJsOrTsConfig && !hasJsonConfig) {
        newConfigCreated = CliRunner.createDefaultConfig(localJsOrTsValue);
      }

      if (hasJsOrTsConfig || newConfigCreated) {
        this.argv.config = localJsOrTsValue;
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
   * @returns {CliRunner|Promise}
   */
  parseTestSettings(settings = {}, asyncLoading = true) {
    this.userSettings = lodashClone(settings, true);
    const result = this.initTestSettings(settings, this.baseSettings, this.argv, this.testEnv, asyncLoading);

    if (result instanceof Promise) {
      return result;
    }

    return this;
  }

  runGlobalHook(key, args = [], isParallelHook = false) {
    let promise;
    const {globals} = this.test_settings;

    if (isParallelHook && Concurrency.isChildProcess() || !isParallelHook && !Concurrency.isChildProcess()) {
      const start_time = new Date();

      if (Utils.isFunction(globals[key])) {
        NightwatchEventHub.emit(GlobalHook[key].started, {
          start_time: start_time
        });
      }
      
      promise = this.globals.runGlobalHook(key, args);

      return promise.finally(() => {
        if (Utils.isFunction(globals[key])) {
          NightwatchEventHub.emit(GlobalHook[key].finished, {
            start_time: start_time,
            end_time: new Date()
          });
        }
      });
    }
 
    return Promise.resolve();
  }

  validateTestEnvironments() {
    for (let i = 0; i < this.testEnvArray.length; i++) {
      if (this.testEnvArray[i] === 'default') {
        continue;
      }
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
    const testWorkers =  this.test_settings.testWorkersEnabled && !singleSourceFile(this.argv);
    if (!testWorkers) {
      return false;
    }

    for (const env of this.testEnvArray) {
      const {webdriver = {}} = this.testEnvSettings[env];
      const desiredCapabilities = this.testEnvSettings[env].capabilities || this.testEnvSettings[env].desiredCapabilities;
      
      if (isMobile(desiredCapabilities)) {
        
        if  (Concurrency.isChildProcess()) {
          Logger.info('Disabling parallelism while running tests on mobile platform');
        }
        
        return false;
      }

      if (isSafari(desiredCapabilities) && isLocalhost(webdriver)) {
        this.isSafariEnvPresent = true;
        if (Concurrency.isMasterProcess()) {
          // eslint-disable-next-line no-console
          console.warn('Running tests in parallel is not supported in Safari. Tests will run in serial mode.');
        }

        return false;
      }
    }


    return true;
  }

  parallelMode() {
    return this.testEnvArray.length > 1 || this.testWorkersMode;
  }

  setupConcurrency() {
    this.concurrency = new Concurrency(this.test_settings, this.argv, this.isTestWorkersEnabled());

    return this;
  }

  isConcurrencyEnabled() {
    return this.testRunner.supportsConcurrency && this.parallelMode();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Test runner related
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  executeTestRunner(modules) {
    return this.testRunner.run(modules);
  }

  createTestRunner() {
    this.testRunner = Runner.create(this.test_settings, this.argv, {
      globalHooks: this.globals ? this.globals.hooks : null,
      globalsInstance: this.globals
    });

    this.processListener.setTestRunner(this.testRunner);

    return this;
  }

  get testEnvSettings() {
    if (this.__testEnvSettings) {
      return this.__testEnvSettings;
    }
    this.__testEnvSettings = {};
    for (const env of this.testEnvArray) {
      this.__testEnvSettings[env] = Settings.parse(this.userSettings, this.baseSettings, this.argv, env);
    }

    return this.__testEnvSettings;
  }

  async getTestsFiles() {
    const modules = {};
    for (const env of this.testEnvArray) {
      modules[env] = await Runner.readTestSource(this.testEnvSettings[env], this.argv);
    }

    return modules;
  }

  /**
   *
   * @param [done]
   * @return {*}
   */
  runTests(done = null) {
    return this.runGlobalHook('before', [this.test_settings])
      .then(_ => {
        return this.runGlobalHook('beforeChildProcess', [this.test_settings], true);
      }) 
      .then(_ => {
        return this.getTestsFiles();
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
          promise = Factory.createSeleniumService(this);
        }

        const {real_mobile, avd} = this.test_settings.desiredCapabilities;
        if (!real_mobile && avd) {
          const AndroidServer = require('../androidEmulator.js');
          this.androidServer = new AndroidServer(avd);

          promise = promise.then(() => this.androidServer.launchEmulator());
        }

        return promise.then(() => {
          if (this.isConcurrencyEnabled()) {
            return this.testRunner.runConcurrent(this.testEnvArray, modules, this.isTestWorkersEnabled(), this.isSafariEnvPresent)
              .then(exitCode => {
                if (exitCode > 0) {
                  this.processListener.setExitCode(exitCode);
                }
              });
          }

          return this.executeTestRunner(modules[this.testEnv]);
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

        return this.runGlobalHook('afterChildProcess', [], true)
          .then(_ => {
            return this.runGlobalHook('after');
          })
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

        if (this.androidServer && !this.androidServer.emulatorAlreadyRunning) {
          this.androidServer.killEmulator();
        }

        if (this.test_settings.deviceUDID && !isRealIos(this.test_settings.desiredCapabilities)) {
          killSimulator(this.test_settings.deviceUDID);
        }

        return errorOrFailed;
      });
  }
}

module.exports = CliRunner;
