const child_process = require('child_process');
const SeleniumServer = require('./selenium-server.js');
const Logger = require('../../util/logger.js');

class WebDriver extends SeleniumServer {
  createProcess() {
    Logger.info(`Starting ${this.serviceName} on port ${this.settings.port}...`);

    this.process = child_process.spawn(this.settings.server_path, this.cliArgs, WebDriver.spawnOptions);

    this.checkProcessTimeout = setTimeout(() => {
      if (!this.resolved) {
        Logger.error(`Timeout while waiting for ${this.serviceName} to start.`);
        this.stop();
      }
    }, WebDriver.defaultGlobalStartTimeout);

    return this;
  }

  get initialCheckProcessDelay() {
    return 0;
  }

  get errorMessages() {
    return {
      binaryMissing: `The path to the ${this.serviceName} binary is not set. Please set "webdriver.server_path" config option.`
    };
  }
}

module.exports = WebDriver;