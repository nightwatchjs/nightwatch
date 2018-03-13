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
    Settings.replaceEnvVariables(this.settings);

    this.inheritFromDefaultEnv();
    this.setCliOptions();
    this.setUnitTestsMode();
    this.setParallelMode();
    this.setTestRunner();

    if (typeof this.settings.src_folders == 'string') {
      this.settings.src_folders = [this.settings.src_folders];
    }

    if (Array.isArray(this.settings.skiptags)) {
      this.settings.skiptags = this.settings.skiptags.split(',');
    }

    if (this.settings.skipgroup) {
      this.settings.skiptags = this.settings.skipgroup.split(',');
    }

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

  static setDefaults(settings) {
    defaultsDeep(settings, Settings.DEFAULTS);

    if (!settings.unit_tests_mode) {
      settings.skip_testcases_on_fail = settings.skip_testcases_on_fail ||
        typeof settings.skip_testcases_on_fail == 'undefined';
    }
  }

  inheritFromDefaultEnv() {
    if (!this.baseSettings.test_settings) {
      return this;
    }

    let defaultEnvSettings = this.baseSettings.test_settings[Settings.DEFAULT_ENV] || {};
    lodashMerge(this.settings, defaultEnvSettings);

    if (!this.testEnv || this.testEnv === Settings.DEFAULT_ENV) {
      return this;
    }

    let testEnvSettings = this.baseSettings.test_settings[this.testEnv] || {};
    defaultsDeep(testEnvSettings, defaultEnvSettings);

    Object.assign(this.settings, testEnvSettings);

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
  static replaceEnvVariables(target) {
    for (const key in target) {
      switch (typeof target[key]) {
        case 'object':
          Settings.replaceEnvVariables(target[key]);
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