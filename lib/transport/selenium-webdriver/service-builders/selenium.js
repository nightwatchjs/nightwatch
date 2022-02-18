const {SeleniumServer} = require('selenium-webdriver/remote');
const {Logger, isObject, isNullOrEmpty} = require('../../../utils');
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

  static parseCliArgs(settings) {
    const {cli_args, jvmArgs} = settings;
    const cliArgs = jvmArgs || cli_args;

    if (Array.isArray(cliArgs)) {
      return super.setCliArgs(cliArgs);
    }

    const parsedJvmArgs = [];
    const parsedCliArgs = [];

    if (isObject(cliArgs)) {
      Object.keys(cliArgs).forEach(key => {

        const isEmptyValue = isNullOrEmpty(cliArgs[key]);
        const isJvmArg = !key.startsWith('-');

        const property = isJvmArg ? `-D${key}` : key;
          
        if (isJvmArg) {

          const finalArgument = isEmptyValue ? property : `${property}=${cliArgs[key]}`; 
          parsedJvmArgs.unshift(finalArgument);
          
        } else {
        
          if (!isEmptyValue) { 
            parsedCliArgs.unshift(cliArgs[key]);
          }; 
          parsedCliArgs.unshift(property);
        
        }
      });
    }

    return {parsedCliArgs, parsedJvmArgs};
  }

  setCliArgs() {
    const {parsedCliArgs, parsedJvmArgs} = SeleniumServiceBuilder.parseCliArgs(this.settings.selenium);
    this.jvmArgs = parsedJvmArgs;
    this.cliArgs.unshift(...parsedCliArgs);
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
