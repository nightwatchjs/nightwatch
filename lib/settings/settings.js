const defaultsDeep = require('lodash.defaultsdeep');
const clone = require('lodash.clone');
const lodashMerge = require('lodash.merge');

const Globals = require('./globals.js');
const Defaults = require('./defaults.js');
const CliRunner = require('../runner/cli/cli.js');

class Settings {

  static get DEFAULTS() {
    return Defaults;
  }

  constructor(baseSettings = {}, argv = {}) {
    this.baseSettings = baseSettings;
    this.argv = argv;
    this.testEnv = null;
    this.settings = Object.assign({}, Settings.DEFAULTS);

    Object.keys(this.baseSettings).forEach(key => {
      if (key !== 'test_settings') {
        this.settings[key] = clone(this.baseSettings[key], true);
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
    this.setStartSession();
    this.setCliOptions();

    if (this.settings.skiptags) {
      this.settings.skiptags = this.settings.skiptags.split(',');
    }

    if (this.settings.skipgroup) {
      this.settings.skiptags = this.settings.skipgroup.split(',');
    }

    return this;
  }

  inheritFromDefaultEnv() {
    if (!this.baseSettings.test_settings) {
      return this;
    }

    if (!this.testEnv || this.testEnv === CliRunner.DEFAULT_ENV) {
      return this;
    }

    let testEnvSettings = this.baseSettings.test_settings[this.testEnv];
    let defaultEnv = this.baseSettings.test_settings[CliRunner.DEFAULT_ENV] || {};
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

  readExternalGlobals() {
    if (this.settings.globals_path) {
      const externalGlobals = Globals.readExternal(this.settings.globals_path, this.testEnv);

      // if we already have globals, make a copy of them
      let globals = this.settings.globals ? clone(this.settings.globals, true) : {};
      lodashMerge(globals, externalGlobals);

      this.settings.globals = globals;
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
    this.readExternalGlobals();
    let sortedSettings = {};
    Object.keys(this.settings).sort().forEach(key => {
      sortedSettings[key] = this.settings[key];
    });

    this.settings = sortedSettings;
  }
}

module.exports = Settings;