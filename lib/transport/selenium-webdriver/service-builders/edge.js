const edge = require('selenium-webdriver/edge');
const BaseService = require('./base-service.js');

class EdgeServiceBuilder extends BaseService {
  static get serviceName() {
    return 'EdgeDriver';
  }

  static get defaultPort() {
    return 9514;
  }

  get requiresDriverBinary() {
    return false;
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

    let enableVerboseLogging = true;

    if (Array.isArray(this.cliArgs)) {
      this.service.addArguments(...this.cliArgs);

      for (const arg of this.cliArgs) {
        if (arg === '--silent' || arg.startsWith('--log-level=')) {
          enableVerboseLogging = false;
          break;
        }
      }
    }

    if (enableVerboseLogging) {
      this.service.enableVerboseLogging();
    }

    return super.createService();
  }
}

module.exports = EdgeServiceBuilder;
