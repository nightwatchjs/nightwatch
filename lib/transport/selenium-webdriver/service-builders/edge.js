const edge = require('selenium-webdriver/edge');
const BaseService = require('./base-service.js');

class EdgeServiceBuilder extends BaseService {
  static get serviceName() {
    return 'EdgeDriver';
  }

  static get defaultPort() {
    return 9514;
  }

  get outputFile() {
    return this._outputFile + '_msedgedriver.log';
  }

  get serviceName() {
    return EdgeServiceBuilder.serviceName;
  }

  get serviceDownloadUrl() {
    return 'https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/';
  }

  /**
   * @param {Capabilities} options
   * @returns {Promise<void>}
   */
  async createService(options) {
    const {server_path} = this.settings.webdriver;
    this.service = new edge.ServiceBuilder(server_path);

    if (Array.isArray(this.cliArgs)) {
      this.service.addArguments(...this.cliArgs);
    }

    this.service.enableVerboseLogging();

    return super.createService();
  }
}

module.exports = EdgeServiceBuilder;
