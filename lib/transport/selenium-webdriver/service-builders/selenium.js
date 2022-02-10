const {SeleniumServer} = require('selenium-webdriver/remote');
const {Logger, isObject, isUndefined} = require('../../../utils');
const BaseService = require('./base-service.js');

class SeleniumServiceBuilder extends BaseService {
  static get serviceName() {
    return 'Selenium Server';
  }

  static get defaultPort() {
    return 4444;
  }

  get npmPackageName() {
    return 'chromedriver';
  }

  get outputFile() {
    return this._outputFile + '_selenium-server.log';
  }

  get defaultPort() {
    return SeleniumServiceBuilder.defaultPort;
  }

  get serviceName() {
    return 'Selenium Server';
  }

  get serviceDownloadUrl() {
    return 'https://selenium.dev/download/';
  }

  setCliArgs() {
    const {cli_args, jvmArgs} = this.settings.selenium;
    let cliArgs = jvmArgs || cli_args;

    if (Array.isArray(cliArgs)) {
      return super.setCliArgs(cliArgs);
    }

    this.jvmArgs = [];

    if (isObject(cliArgs)) {
      Object.keys(cliArgs).forEach(key => {
        if (!isUndefined(cliArgs[key])) {
          let property = '';
          let isJvmArg = !key.startsWith('-');

          if (isJvmArg) {
            property += '-D';
          }

          property += key;

          if (!cliArgs[key]) {
            this.cliArgs.unshift(property);

            return;
          }

          if (isJvmArg) {
            this.jvmArgs.unshift(`${property}=${cliArgs[key]}`);
          } else {
            this.cliArgs.unshift(property, cliArgs[key]);
          }

        }
      });
    }
  }

  /**
   * @param {Capabilities} opts
   * @returns {Promise<void>}
   */
  async createService(opts) {
    const {default_path_prefix, server_path} = this.settings.webdriver;
    const {port} = this;
    Logger.info(`Starting ${this.serviceName} on port ${port}...`);

    const options = new SeleniumServer.Options();
    if (port) {
      options.port = port;
    }

    // TODO: read the log_path and add it to cliArgs
    options.args = this.cliArgs;
    options.jvmArgs = this.jvmArgs;

    if (this.hasSinkSupport() && this.needsSinkProcess()) {
      this.createSinkProcess();
      options.stdio = ['pipe', this.process.stdin, this.process.stdin];
    }

    this.service = new SeleniumServer(server_path, options);

    return this.service.start();
  }
}

module.exports = SeleniumServiceBuilder;
