const path = require('path');
const TestSource = require('./test-source.js');
const Settings = require('../../settings/settings.js');
const Concurrency = require('../concurrency/concurrency.js');
const Utils = require('../../util/utils.js');
const Logger = require('../../util/logger.js');
const Runner = require('../runner.js');
const WebDriver = require('../webdriver-server.js');

class CliRunner {
  static get DEFAULT_ENV() {
    return 'default';
  }

  static get CONFIG_JS_FILE() {
    return './nightwatch.conf.js';
  }

  constructor(argv = {}) {
    this.argv = argv;
    this.argvSetup = require('./argv-setup.js');
    this.baseSettings = this.loadConfig();
    this.concurrency = new Concurrency(this.baseSettings, this.argv);
    this.testSource = new TestSource(this.baseSettings.src_folders, this.argv);

    this.setCurrentTestEnv();

    this.manageSelenium = this.isSeleniumServerManaged();
  }

  static parseSettings(settings = {}, baseSettings = {}, argv = {}, testEnv = null) {
    let instanceSettings = new Settings(baseSettings, argv);
    instanceSettings.init(testEnv, settings);

    return instanceSettings.settings;
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
    this.testEnv = typeof this.argv.env == 'string' ? this.argv.env : CliRunner.DEFAULT_ENV;
    this.testEnvArray = this.testEnv.split(',');

    this.availableTestEnvs = Object.keys(this.baseSettings.test_settings).map(key => {
      return typeof this.baseSettings.test_settings[key] == 'object' && this.baseSettings.test_settings[key];
    });

    this.validateTestEnvironments();

    return this;
  }

  isSeleniumServerManaged() {
    return !Concurrency.isParallelMode() && this.baseSettings.selenium && this.settings.selenium.start_process || false
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
   * @deprecated
   * @param {object} [settings]
   * @return {CliRunner}
   */
  setup(settings) {
    this.parseTestSettings(settings);

    return this;
  }

  isDefaultConfig() {
    return this.argvSetup.command('config').isDefault(this.argv.config);
  }

  loadConfig() {
    // use default nightwatch.json file if we haven't received another value
    if (this.isDefaultConfig()) {
      let defaultValue = this.argvSetup.command('config').defaults();
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
   * @param {function} [done]
   * @returns {CliRunner}
   */
  parseTestSettings(settings = {}) {
    // checking if the env passed is valid
    if (this.baseSettings && !this.baseSettings.test_settings) {
      throw new Error('No testing environment defined in the configuration file.\n'+
        '  Please consult the docs at: http://nightwatchjs.org/gettingstarted#settings-file');
    }

    this.initTestSettings(settings);
    this.setLoggingOptions();

    return this;
  }

  parallelModeWorkers() {
    return this.test_settings.testWorkersEnabled && !this.testSource.isTestWorker();
  }

  /**
   * Sets the specific test settings for the specified environment
   * @param {object} [settings]
   * @returns {CliRunner}
   */
  initTestSettings(settings = {}) {
    this.test_settings = CliRunner.parseSettings(settings, this.baseSettings, this.argv, this.testEnv);

    return this;
  }

  validateTestEnvironments() {
    for (let i = 0; i < this.testEnvArray.length; i++) {
      if (!(this.testEnvArray[i] in this.baseSettings.test_settings)) {
        throw new Error(`Invalid testing environment specified: ${this.testEnvArray[i]}. Available environments are: ${this.availableTestEnvs.join(', ')}`);
      }
    }

    return this;
  }

  startWebDriver() {
    this.wdServer = new WebDriver(this.test_settings);

    return this.wdServer.start().catch(err => {
      Logger.error(err.toString() + '\n');

      let errorOut = this.wdServer.instance.errorOutput;
      errorOut = errorOut.split('\n');

      console.error(errorOut.reduce(function(prev, message) {
        if (prev.indexOf(message) < 0) {
          prev.push(message);
        }

        return prev;
      }, []).join('\n'));

      throw err;
    });
  }

  stopWebDriver() {
    return this.wdServer.stop();
  }

  /**
   *
   * @param [done]
   * @return {*}
   */
  runTests(done = null) {
    if (this.testEnvArray.length > 1) {
      this.concurrency.runEnvironments(this.testEnvArray, done);

      return this;
    }

    if (this.parallelModeWorkers()) {
      this.concurrency.runTestWorkers(done);

      return this;
    }

    let runner = new Runner(this.testSource.getTestSource(), this.test_settings);
    let result = runner.run();

    if (typeof done == 'function') {
      return result.then(done);
    }

    return result;
  }
}

module.exports = CliRunner;
