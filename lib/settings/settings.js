const dotenv = require('dotenv');
const defaultsDeep = require('lodash.defaultsdeep');
const lodashClone = require('lodash.clone');
const lodashMerge = require('lodash.merge');
const CI_Info = require('ci-info');
const Defaults = require('./defaults.js');
const Utils = require('../utils');
const {Logger} = Utils;

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

  constructor(baseSettings = null, argv = {}) {
    this.baseSettings = baseSettings || {};
    this.argv = argv;
    this.testEnv = '';

    let defaults = lodashClone(Settings.DEFAULTS, true);
    this.settings = Object.assign({}, defaults);

    // copy all other properties outside the "test_settings" environments
    Object.keys(this.baseSettings).forEach(key => {
      if (key === 'test_settings') {
        return;
      }

      let copyVal = lodashClone(this.baseSettings[key], true);

      if (Utils.isObject(this.settings[key])) {
        Object.assign(this.settings[key], copyVal);
      } else {
        this.settings[key] = copyVal;
      }
    });
  }

  get testWorkersEnabled() {
    return this.settings.test_workers === true || this.settings.test_workers && this.settings.test_workers.enabled;
  }

  adaptSettings() {
    this.inheritFromDefaultEnv();
    this.setCliOptions();
    this.setUnitTestsMode();
    this.setParallelMode();
    this.setTestRunner();
    this.setWebdriverSettings();

    if (typeof this.settings.src_folders == 'string') {
      this.settings.src_folders = [this.settings.src_folders];
    }

    if (typeof this.settings.skipgroup == 'string' && this.settings.skipgroup.length > 0) {
      this.settings.skipgroup = this.settings.skipgroup.split(',');
    }

    return this;
  }

  setParallelMode() {
    const Concurrency = require('../runner/concurrency/concurrency.js');

    if (Concurrency.isChildProcess()) {
      this.settings.parallel_mode = true;
    }

    const envArray = this.testEnv.split(',');
    if (envArray.length > 1 && this.testWorkersEnabled) {
      if (typeof this.settings.test_workers == 'boolean') {
        this.settings.test_workers = {
          enabled: this.settings.test_workers
        };
        this.baseSettings.test_workers = {
          enabled: this.baseSettings.test_workers
        };
      }

      this.settings.test_workers.enabled = false;
      this.baseSettings.test_workers.enabled = false;
      this.settings.testWorkersEnabled = false;
      Logger.error('Test workers are disabled when running multiple test environments in parallel.\n');
    } else {
      this.settings.testWorkersEnabled = this.testWorkersEnabled;
    }

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

  setWebdriverSettings() {
    if (this.settings.selenium && this.settings.selenium.start_process) {
      lodashMerge(this.settings.webdriver, this.settings.selenium);
    } else if (this.settings.selenium) {
      defaultsDeep(this.settings.webdriver, this.settings.selenium);
    }

    if (this.settings.start_session === undefined && this.settings.webdriver.start_session !== undefined) {
      this.settings.start_session = this.settings.webdriver.start_session;
    }

    if (this.settings.request_timeout_options) {
      defaultsDeep(this.settings.webdriver.timeout_options, this.settings.request_timeout_options);
    }

    return this;
  }

  setUnitTestsMode() {
    if (this.settings.unit_tests_mode) {
      this.settings.webdriver.start_process = false;
      this.settings.webdriver.start_session = false;
      this.settings.start_session = false;
      this.settings.detailed_output = false;
      this.settings.output_timestamp = false;
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

    const defaultEnvSettings = this.baseSettings.test_settings[Settings.DEFAULT_ENV] || {};
    lodashMerge(this.settings, defaultEnvSettings);

    if (!this.testEnv || this.testEnv === Settings.DEFAULT_ENV) {
      return this;
    }

    const testEnvSettings = this.baseSettings.test_settings[this.testEnv] || {};
    if (testEnvSettings.extends) {
      const superEnv = this.baseSettings.test_settings[testEnvSettings.extends] || {};
      defaultsDeep(superEnv, defaultEnvSettings);
      defaultsDeep(testEnvSettings, superEnv);
    } else {
      defaultsDeep(testEnvSettings, defaultEnvSettings);
    }

    lodashMerge(this.settings, testEnvSettings);

    return this;
  }

  /**
   * @deprecated
   * @param settings
   */
  persistGlobals(settings) {
    if (this.settings.persist_globals === true && settings.globals) {
      let globals = settings.globals;
      Object.keys(this.settings.globals).forEach(key => {
        globals[key] = this.settings.globals[key];
      });

      this.settings.globals = globals;
    }
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

  sortSettings() {
    const sortedSettings = {};
    Object.keys(this.settings).sort().forEach(key => {
      sortedSettings[key] = this.settings[key];
    });

    this.settings = sortedSettings;
  }

  setColorOutput() {
    const {isCI, CIRCLE, JENKINS, NETLIFY, TRAVIS, GITLAB} = CI_Info;
    let coloringSupport = CIRCLE || JENKINS || NETLIFY || TRAVIS || GITLAB;

    if (isCI && !coloringSupport) {
      this.settings.disable_colors = true;
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
    this.persistGlobals(settings);

    dotenv.config(this.settings.dotenv);
    Settings.replaceEnvVariables(this.settings);

    this.sortSettings();
    this.setColorOutput();
  }
}

module.exports = Settings;
