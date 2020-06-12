const child_process = require('child_process');
const Utils = require('../../utils');
const JsonWireProtocol = require('./jsonwireprotocol.js');
const {Logger} = Utils;

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
    return 'https://selenium.dev/download/';
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
    let binaryMissing = 'The path to the Selenium Server .jar file is not set.';
    let packageName = 'selenium-server';

    binaryMissing += '\n\n ' + Logger.colors.yellow(`You can either install ${packageName} from NPM: \n\tnpm install ${packageName} --save-dev\n\n`);
    binaryMissing += `or download the Selenium Server from ${this.serviceDownloadUrl} and set the ` +
      '"selenium.server_path" config option to point to the .jar file.\n' +
      'You can get an overview of all Selenium Server versions and additional driver files by visiting\n' +
      '      https://selenium-release.storage.googleapis.com/index.html\n';

    return {
      binaryMissing
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
