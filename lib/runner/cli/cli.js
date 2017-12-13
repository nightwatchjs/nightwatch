const path = require('path');
const TestSource = require('./test-source.js');
const Settings = require('../../settings/settings.js');
const Concurrency = require('../concurrency/concurrency.js');
const Logger = require('../../util/logger.js');
const Utils = require('../../util/utils.js');

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

    return this;
  }

  isSeleniumServerManaged() {
    return !this.isParallelMode() && this.baseSettings.selenium && this.settings.selenium.start_process || false
  }

  /**
   * @deprecated
   * @param {function} [done]
   * @return {CliRunner}
   */
  init(done) {
    this.parseTestSettings({}, done);

    return this;
  }

  /**
   * @param {object} [settings]
   * @param {function} [done]
   * @return {CliRunner}
   */
  setup(settings, done) {
    this.parseTestSettings(settings, done);

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
  parseTestSettings(settings = {}, done = function() {}) {
    // checking if the env passed is valid
    if (this.baseSettings && !this.baseSettings.test_settings) {
      throw new Error('No testing environment defined in the configuration file.\n'+
        '  Please consult the docs at: http://nightwatchjs.org/gettingstarted#settings-file');
    }

    let env = this.argv && this.argv.env;

    if (env) {
      const envs = env.split(',');

      for (let i = 0; i < envs.length; i++) {
        if (!(envs[i] in this.baseSettings.test_settings)) {
          let available = Object.keys(this.baseSettings.test_settings).map(key => {
            return typeof this.baseSettings.test_settings[key] == 'object' && this.baseSettings.test_settings[key];
          });

          throw new Error(`Invalid testing environment specified: ${envs[i]}. Available environments are: ${available.join(', ')}`);
        }
      }

      if (envs.length > 1) {
        this.concurrency.runEnvironments(envs, done);
        return this;
      }
    }

    this.initTestSettings(settings);

    if (this.parallelModeWorkers()) {
      this.concurrency.runTestWorkers(done);
    }

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

    if (this.test_settings.disable_colors) {
      Logger.disableColors();
    }

    return this;
  }
}

module.exports = CliRunner;
