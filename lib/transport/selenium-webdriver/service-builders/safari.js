const {Capabilities} = require('selenium-webdriver');
const safari = require('selenium-webdriver/safari');
const BaseService = require('./base-service.js');

const OPTIONS_CAPABILITY_KEY = 'safari.options';
const TECHNOLOGY_PREVIEW_OPTIONS_KEY = 'technologyPreview';
const SAFARIDRIVER_TECHNOLOGY_PREVIEW_EXE = '/Applications/Safari Technology Preview.app/Contents/MacOS/safaridriver';

function useTechnologyPreview(o) {
  if (o instanceof Capabilities) {
    let options = o.get(OPTIONS_CAPABILITY_KEY);

    return !!(options && options[TECHNOLOGY_PREVIEW_OPTIONS_KEY]);
  }

  if (o && typeof o === 'object') {
    return !!o[TECHNOLOGY_PREVIEW_OPTIONS_KEY];
  }

  return false;
}

class SafariServiceBuilder extends BaseService {
  static get serviceName() {
    return 'SafariDriver';
  }

  get requiresDriverBinary() {
    return false;
  }

  get outputFile() {
    return this._outputFile + '_safaridriver.log';
  }

  /**
   * Port will be auto generated and probed by selenium
   * @returns {number}
   */
  get defaultPort() {
    return 0;
  }

  get serviceName() {
    return SafariServiceBuilder.serviceName;
  }

  /**
   * @param {Capabilities} options
   * @returns {Promise<void>}
   */
  async createService(options) {
    if (useTechnologyPreview(options.get(OPTIONS_CAPABILITY_KEY))) {
      this.settings.webdriver.server_path = SAFARIDRIVER_TECHNOLOGY_PREVIEW_EXE;
    }

    this.service = new safari.ServiceBuilder(this.settings.webdriver.server_path);

    if (Array.isArray(this.cliArgs)) {
      this.service.addArguments(...this.cliArgs);
    }

    return super.createService(options);
  }
}

module.exports = SafariServiceBuilder;
