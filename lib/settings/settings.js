const dotenv = require('dotenv');
const path = require('path');
const defaultsDeep = require('lodash.defaultsdeep');
const lodashClone = require('lodash.clone');
const lodashMerge = require('lodash.merge');
const CI_Info = require('ci-info');
const Defaults = require('./defaults.js');
const Utils = require('../utils');
const {isObject, isUndefined, isDefined, isNumber, singleSourceFile} = Utils;

class Settings {

  static get DEFAULT_ENV() {
    return 'default';
  }

  static get DEFAULTS() {
    return Defaults;
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
          target[key] = target[key].replace(/\${(\w+)\|?([^}]*)}/, function(match, varName, defaultValue) {
            return process.env[varName] || defaultValue || '${' + varName + '}';
          });
          break;
      }
    }

    return this;
  }

  static getDefaults() {
    return lodashClone(Settings.DEFAULTS, true);
  }

  /**
   * Called from the cli runner with data from config file
   *
   * @param {Object} [settings] additional settings which can be passed when called programmatically
   * @param {Object} [baseSettings] settings data from nightwatch config file
   * @param {Object} [argv] cli arguments object
   * @param {String} [testEnv] current test environment
   * @returns {Object}
   */
  static parse(settings = {}, baseSettings = {}, argv = {}, testEnv = '') {
    const instance = new Settings(argv, testEnv);
    instance.fromConfigFile(baseSettings);
    instance.inheritFromDefaultEnv();
    instance.init(settings);

    return instance.settings;
  }

  /**
   * Called from Nightwatch main client instance containing either an existing settings object or a new one
   *
   * @param {Object} userSettings
   * @param {Object} argv
   * @returns {Object}
   */
  static fromClient(userSettings = {}, argv = {}) {
    const instance = new Settings(argv);
    instance.init(userSettings);

    return instance.settings;
  }

  static isNightwatchObject(settings) {
    return isDefined(settings['[[@nightwatch_createdAt]]']);
  }

  /**
   * @deprecated
   * @param settings
   */
  static setDefaults(settings) {
    defaultsDeep(settings, Defaults);

    if (settings.unit_testing_mode) {
      settings.unit_tests_mode = true;
    }

    if (!settings.unit_tests_mode) {
      settings.skip_testcases_on_fail = settings.skip_testcases_on_fail || isUndefined(settings.skip_testcases_on_fail);
    }
  }

  static isUsingSeleniumServer(settings) {
    return settings.selenium && settings.selenium.start_process;
  }

  get testWorkersEnabled() {
    const {test_workers} = this.settings;

    if (this.argv.parallel === false || this.argv.parallel === 'false' 
        || this.argv.serial === true 
        || isNumber(this.argv.workers) && this.argv.workers === 1) {
      return false;
    }

    return this.argv.parallel === true || test_workers === true || isObject(test_workers) && test_workers.enabled;
  }

  /**
   * @param {Object} [argv] the cli arguments object
   * @param {String} [testEnv] the current test env
   */
  constructor(argv = {}, testEnv = '') {
    this.baseSettings = null;
    this.argv = argv;
    this.testEnv = testEnv || '';

    this.initSettingsObject();
  }

  /**
   * @param {Object|null} [baseSettings] the raw nightwatch config object
   * @param baseSettings
   */
  fromConfigFile(baseSettings) {
    this.baseSettings = baseSettings || {};
    this.copyGenericProperties();
  }

  /**
   * Initialize a new settings object based on the defaults
   */
  initSettingsObject() {
    this.settings = Settings.getDefaults();
    this.settings.testEnv = this.testEnv;
  }

  /**
   * Copy all properties from the config file to this.settings that are located outside any test environment
   *  defined as part of the "test_settings" dictionary;
   *
   * This allows to define non-standard properties to the Nightwatch settings object
   */
  copyGenericProperties() {
    Object.keys(this.baseSettings).forEach(key => {
      if (key === 'test_settings') {
        return;
      }

      const copyVal = lodashClone(this.baseSettings[key], true);

      if (isObject(this.settings[key])) {
        Object.assign(this.settings[key], copyVal);
      } else {
        this.settings[key] = copyVal;
      }
    });
  }

  isSettingsDefined(settingName) {
    const {webdriver} = this.settings;

    if (isObject(webdriver[settingName])) {
      const values = Object.values(webdriver[settingName]);

      return values.every(item => isDefined(item));
    }

    return isDefined(webdriver[settingName]);
  }
  /**
   * Tries to set a webdriver setting from a several legacy places if the value is not already set
   *
   * @param {String} newSetting the new property name
   * @param {String|Array} [oldSetting]
   * @param {Object} [opts]
   * @returns {Settings} for chaining
   */
  setWebdriverHttpOption(newSetting, oldSetting, opts = {}) {
    const webdriverOpts = this.settings.webdriver;

    if (this.isSettingsDefined(newSetting)) {
      return this;
    }

    if (oldSetting === undefined) {
      oldSetting = [newSetting];
    } else if (!Array.isArray(oldSetting)) {
      oldSetting = [oldSetting];
    }

    for (let i = 0; i < oldSetting.length; i++) {
      const item = oldSetting[i];
      if (isDefined(this.settings[item])) {
        webdriverOpts[newSetting] = this.settings[item];

        return this;
      }
    }

    if (isDefined(opts.defaultValue)) {
      webdriverOpts[newSetting] = opts.defaultValue;
    }

    return this;
  }

  isUsingSelenium() {
    const {selenium} = this.settings;

    return isObject(selenium);
  }

  isSeleniumServerManaged() {
    return this.isUsingSelenium() && this.settings.selenium.start_process;
  }

  /**
   * Set the connection settings to the Webdriver server and any networking options
   */
  setWebdriverSettings() {
    // if using selenium server, we read settings from the selenium dictionary
    if (this.isSeleniumServerManaged()) {
      lodashMerge(this.settings.webdriver, this.settings.selenium);
    } else if (this.isUsingSelenium()) {
      defaultsDeep(this.settings.webdriver, this.settings.selenium);
    }

    this
      .setWebdriverHttpOption('host', ['seleniumHost', 'selenium_host'], {defaultValue: 'localhost'})
      .setWebdriverHttpOption('port', ['seleniumPort', 'selenium_port'])
      .setWebdriverHttpOption('ssl', ['useSsl', 'use_ssl'])
      .setWebdriverHttpOption('proxy')
      .setWebdriverHttpOption('start_session')
      .setWebdriverHttpOption('timeout_options', 'request_timeout_options')
      .setWebdriverHttpOption('default_path_prefix')
      .setWebdriverHttpOption('username')
      .setWebdriverHttpOption('access_key', ['accessKey', 'access_key', 'password']);

    if (isUndefined(this.settings.webdriver.ssl)) {
      this.settings.webdriver.ssl = this.settings.webdriver.port === 443;
    }

    if (!this.settings.webdriver.host) {
      this.settings.webdriver.host = this.settings.selenium_host || 'localhost';
    }

    this.setServerUrl();
  }

  /**
   * Set the webdriver server url which will be used in case the service is not managed by Nightwatch
   */
  setServerUrl() {
    const protocol = this.settings.webdriver.ssl ? 'https' : 'http';
    const {port, host, default_path_prefix = ''} = this.settings.webdriver;
    this.settings.webdriver.url = `${protocol}://${host}:${port}${default_path_prefix}`;

    if (isObject(this.settings.selenium)) {
      this.settings.selenium.url = this.settings.webdriver.url;
    }
  }

  mergeOntoExisting(userSettings = {}) {
    lodashMerge(this.settings, userSettings);

    return this;
  }

  /**
   * @returns {Settings}
   */
  adaptSettings() {
    this.setCliOptions();
    this.setScreenshotsOptions();
    this.setUnitTestsMode();
    this.setParallelMode();
    this.setTestRunner();
    this.setReporterOptions();

    if (typeof this.settings.src_folders == 'string') {
      this.settings.src_folders = [this.settings.src_folders];
    }

    if (typeof this.settings.skipgroup == 'string' && this.settings.skipgroup.length > 0) {
      this.settings.skipgroup = this.settings.skipgroup.split(',');
    }

    return this;
  }

  setReporterOptions() {
    defaultsDeep(this.settings, this.settings.reporter_options);

    if (this.argv.trace === true) {
      this.settings.trace.enabled = true;
    }
  }

  setParallelMode() {
    const Concurrency = require('../runner/concurrency');

    if (Concurrency.isChildProcess()) {
      this.settings.parallel_mode = true;
    }

    if (this.argv.parallel === true && !this.settings.test_workers) {
      this.settings.test_workers = true;
    } else if (isNumber(this.argv.parallel)) {
      if (!isObject(this.settings.test_workers)) {
        this.settings.test_workers = {
          enabled: true
        };
      }

      this.settings.test_workers.workers = this.argv.parallel || this.settings.test_workers.workers;
    } else if (isNumber(this.argv.workers)) {
      if (!isObject(this.settings.test_workers)) {
        this.settings.test_workers = {
          enabled: true
        };
      }

      this.settings.test_workers.workers = this.argv.workers || this.settings.test_workers.workers;
    }

    this.settings.testWorkersEnabled = this.testWorkersEnabled && (!singleSourceFile(this.argv) || this.argv['test-worker'] === true);

    return this;
  }

  setTestRunner() {
    if (Utils.isString(this.settings.test_runner)) {
      this.settings.test_runner = {
        type: this.settings.test_runner,
        options: {}
      };
    } if (!Utils.isObject(this.settings.test_runner)) {
      throw new Error(`Invalid "test_runner" settings specified; received: ${this.settings.test_runner}`);
    }

    return this;
  }

  setUnitTestsMode() {
    const unitTesting = this.settings.unit_tests_mode || this.settings.unit_testing_mode;

    this.settings.unit_testing_mode = this.settings.unit_tests_mode = unitTesting;

    if (unitTesting) {
      this.settings.webdriver.start_process = false;
      this.settings.webdriver.start_session = false;
      this.settings.start_session = false;
      this.settings.detailed_output = false;
      this.settings.output_timestamp = false;
    } else {
      this.settings.skip_testcases_on_fail = this.settings.skip_testcases_on_fail || isUndefined(this.settings.skip_testcases_on_fail);
    }

    return this;
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
    this.inheritFromSuperEnv(testEnvSettings);
    defaultsDeep(testEnvSettings, defaultEnvSettings);
    lodashMerge(this.settings, testEnvSettings);

    return this;
  }

  inheritFromSuperEnv(testEnvSettings) {
    if (testEnvSettings.extends) { 
      const superEnv = this.baseSettings.test_settings[testEnvSettings.extends] || {};
      delete testEnvSettings.extends;
      defaultsDeep(testEnvSettings, superEnv);

      return this.inheritFromSuperEnv(testEnvSettings);
    }

    return testEnvSettings;
  }

  /**
   * @param settings
   */
  persistGlobals(settings) {
    if (this.settings.persist_globals === true && isObject(settings.globals)) {
      defaultsDeep(settings.globals, this.settings.globals);
      this.settings.globals = settings.globals;
    }
  }

  setScreenshotsOptions() {
    if (isObject(this.settings.screenshots)) {
      this.settings.screenshots.path = this.settings.screenshots.path ? path.resolve(this.settings.screenshots.path) : '';
    } else {
      const enabled = this.settings.screenshots === true;
      this.settings.screenshots = Object.assign({}, Defaults.screenshots, {enabled});
    }

    this.settings.screenshotsPath = this.settings.screenshots.path;

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
      skiptags: this.argv.skiptags,
      enable_fail_fast: this.argv['fail-fast']
    };

    Object.keys(cliOverwrites).forEach(key => {
      if (isDefined(cliOverwrites[key]) && cliOverwrites[key] !== null) {
        this.settings[key] = cliOverwrites[key];
      }
    });

    // TODO: add support for overwriting any setting

    return this;
  }

  sortSettings() {
    const sortedSettings = {};
    Object.keys(this.settings).sort().forEach(key => {
      sortedSettings[key] = this.settings[key];
    });

    this.settings = sortedSettings;

    Object.defineProperty(this.settings, '[[@nightwatch_createdAt]]', {
      value: new Date().valueOf(),
      enumerable: false,
      configurable: false,
      writable: false
    });
  }

  setBaseUrl() {
    const value = this.settings.baseUrl || this.settings.base_url || this.settings.launchUrl || this.settings.launch_url || null;

    if (value) {
      this.settings.baseUrl =
        this.settings.base_url =
        this.settings.launchUrl =
        this.settings.launch_url = value;
    }
  }

  setColorOutput() {
    const {isCI, CIRCLE, JENKINS, NETLIFY, TRAVIS, GITLAB, BUILDKITE} = CI_Info;
    const coloringSupport = CIRCLE || JENKINS || NETLIFY || TRAVIS || GITLAB || BUILDKITE;

    if (isCI && !coloringSupport) {
      this.settings.disable_colors = true;
    }
  }

  /**
   * Validates and parses the test settings
   *
   * @param {Object} [userSettings]
   */
  init(userSettings = {}) {
    this.mergeOntoExisting(userSettings);
    this.setWebdriverSettings();

    this.adaptSettings();
    this.sortSettings();

    this.persistGlobals(userSettings);

    dotenv.config(this.settings.dotenv);
    Settings.replaceEnvVariables(this.settings);

    this.setBaseUrl();
    this.setColorOutput();
  }
}

module.exports = Settings;
