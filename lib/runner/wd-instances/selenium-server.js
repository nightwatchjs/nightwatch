const child_process = require('child_process');
const Logger = require('../../util/logger.js');
const Utils = require('../../util/utils.js');
const JsonWireProtocol = require('./jsonwireprotocol.js');

class SeleniumServer extends JsonWireProtocol {
  static get supportsConcurrency() {
    return true;
  }

  static get serviceName() {
    return 'Selenium Server';
  }

  get outputFile() {
    return 'selenium-server.log';
  }

  get serviceName() {
    return 'Selenium Server';
  }

  get serviceDownloadUrl() {
    return 'https://www.seleniumhq.org/download/';
  }

  get defaultPort() {
    return 4444;
  }

  /**
   * Time to wait (in ms) before starting to check the process if it's online
   *
   * @return {number}
   */
  get initialCheckProcessDelay() {
    return this.settings.check_process_delay;
  }

  get errorMessages() {
    return {
      binaryMissing: 'The path to the Selenium Server .jar file is not set. ' +
      `Please download the Selenium Standalone Server from ${this.serviceDownloadUrl} and set the ` +
      '"selenium.server_path" config option to point to the .jar file. \n\n' +
      'Alternatively you can get an overview of all Selenium Server versions and additional driver files by visiting ' +
      'http://selenium-release.storage.googleapis.com/index.html.'
    };
  }

  setCliArgs() {
    if (Array.isArray(this.settings.cli_args)) {
      return super.setCliArgs();
    }

    if (Utils.isObject(this.settings.cli_args)) {
      Object.keys(this.settings.cli_args).forEach(key => {
        if (this.settings.cli_args[key]) {
          let property = '';
          if (key.indexOf('-D') !== 0) {
            property += '-D';
          }
          property += `${key}=${this.settings.cli_args[key]}`;
          this.cliArgs.unshift(property);
        }
      });
    }
  }

  createProcess() {
    Logger.info(`Starting Selenium Server on port ${this.settings.port}...`);

    this.cliArgs.push(
      '-jar', this.settings.server_path,
      '-port', this.settings.port);

    this.process = child_process.spawn('java', this.cliArgs, SeleniumServer.spawnOptions);
    this.startProcessCreatedTimer();

    return this;
  }
}

module.exports = SeleniumServer;