const defaultsDeep = require('lodash.defaultsdeep');
const lodashClone = require('lodash.clone');
const lodashMerge = require('lodash.merge');
const Defaults = require('./defaults.js');

class Settings {

  static get DEFAULT_ENV() {
    return 'default';
  }

  static get DEFAULTS() {
    return Defaults;
  }

  static parse(settings = {}, baseSettings = {}, argv = {}, testEnv = null) {
    let instanceSettings = new Settings(baseSettings, argv);
    instanceSettings.init(testEnv, settings);

    return instanceSettings.settings;
  }

  constructor(baseSettings = {}, argv = {}) {
    this.baseSettings = baseSettings;
    this.argv = argv;
    this.testEnv = null;
    this.settings = Object.assign({}, Settings.DEFAULTS);

    Object.keys(this.baseSettings).forEach(key => {
      if (key !== 'test_settings') {
        this.settings[key] = lodashClone(this.baseSettings[key], true);
      }
    });
  }

  get testWorkersEnabled() {
    return this.settings.test_workers === true || this.settings.test_workers && this.settings.test_workers.enabled;
  }

  adaptSettings() {
    // reading the settings file
    this.replaceEnvVariables(this.settings);

    if (typeof this.settings.src_folders == 'string') {
      this.settings.src_folders = [this.settings.src_folders];
    }

    this.inheritFromDefaultEnv();
    this.setCliOptions();

    if (Array.isArray(this.settings.skiptags)) {
      this.settings.skiptags = this.settings.skiptags.split(',');
    }

    if (this.settings.skipgroup) {
      this.settings.skiptags = this.settings.skipgroup.split(',');
    }

    this.setUnitTestsMode();
    this.setParallelMode();
    this.setStartSession();
    this.setTestRunner();
    this.setWebdriverSettings();

    return this;
  }

  setParallelMode() {
    const Concurrency = require('../runner/concurrency/concurrency.js');

    if (Concurrency.isChildProcess()) {
      this.settings.parallel_mode = true;
    }

    this.settings.testWorkersEnabled = this.testWorkersEnabled;

    return this;
  }

  setTestRunner() {
    if (typeof this.settings.test_runner == 'string') {
      this.settings.test_runner = {
        type : this.settings.test_runner,
        options: {}
      };
    }

    return this;
  }

  setUnitTestsMode() {
    if (!this.settings.unit_tests_mode && this.settings.compatible_testcase_support && !this.settings.start_session) {
      this.settings.unit_tests_mode = true;
    }

    if (this.settings.unit_tests_mode) {
      this.settings.webdriver.start_process = false;
      this.settings.webdriver.start_session = false;
      this.settings.start_session = false;
      this.settings.detailed_output = false;
    }

    return this;
  }

  inheritFromDefaultEnv() {
    if (!this.baseSettings.test_settings) {
      return this;
    }

    if (!this.testEnv || this.testEnv === Settings.DEFAULT_ENV) {
      return this;
    }

    let testEnvSettings = this.baseSettings.test_settings[this.testEnv];
    let defaultEnv = this.baseSettings.test_settings[Settings.DEFAULT_ENV] || {};
    defaultsDeep(testEnvSettings, defaultEnv);

    Object.assign(this.settings, testEnvSettings);

    return this;
  }

  setStartSession() {
    if (this.settings.selenium) {
      defaultsDeep(this.settings.webdriver, this.settings.selenium);
    }

    if (this.settings.webdriver.start_session === undefined && this.settings.webdriver.start_session !== undefined) {
      this.settings.start_session = this.settings.webdriver.start_session;
    }

    return this;
  }

  setCliOptions() {
    if (this.argv.verbose) {
      this.settings.silent = false;
    }

    const cliOverwrites = {
      output_folder: this.argv.output,
      filename_filter: this.argv.filter,
      tag_filter: this.argv.tag,
      skipgroup: this.argv.skipgroup,
      skiptags: this.argv.skiptags
    };

    Object.keys(cliOverwrites).forEach(key => {
      if (cliOverwrites[key] !== undefined && cliOverwrites[key] !== null) {
        this.settings[key] = cliOverwrites[key];
      }
    });

    // TODO: add support for overwriting any setting

    return this;
  }

  /**
   * Looks for pattern ${VAR_NAME} in settings
   * @param {Object} [target]
   */
  replaceEnvVariables(target) {
    for (const key in target) {
      switch (typeof target[key]) {
        case 'object':
          this.replaceEnvVariables(target[key]);
          break;

        case 'string':
          target[key] = target[key].replace(/\$\{(\w+)\}/g, function(match, varName) {
            return process.env[varName] || '${' + varName + '}';
          });
          break;
      }
    }

    return this;
  }

  setWebdriverSettings() {
    if (this.settings.selenium && this.settings.selenium.start_process) {
      lodashMerge(this.settings.webdriver, this.settings.selenium);
    }
  }

  /**
   * Validates and parses the test settings
   *
   * @param {string} [testEnv]
   * @param {object} [settings]
   */
  init(testEnv = null, settings = {}) {
    if (testEnv) {
      this.testEnv = testEnv;
    }

    lodashMerge(this.settings, settings);

    this.adaptSettings();
    let sortedSettings = {};
    Object.keys(this.settings).sort().forEach(key => {
      sortedSettings[key] = this.settings[key];
    });

    this.settings = sortedSettings;
  }
}

module.exports = Settings;