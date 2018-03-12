const child_process = require('child_process');
const Logger = require('../../util/logger.js');
const BaseWDServer = require('./base-wd-server.js');

class SeleniumServer extends BaseWDServer {
  get outputFile() {
    return 'selenium-server.log';
  }

  get serviceName() {
    return 'Selenium Server';
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
    return 500;
  }

  get errorMessages() {
    return {
      binaryMissing: 'The path to the Selenium Server .jar file is not set. Please set "selenium.server_path" config option.'
    };
  }

  constructor(settings) {
    super(settings);

    this.settings.port = this.settings.port || this.defaultPort;
    this.settings.host = this.settings.host || SeleniumServer.DEFAULT_HOST;

    if (typeof this.settings.server_path !== 'string') {
      throw new Error(this.errorMessages.binaryMissing);
    }
  }

  setCliArgs() {
    if (Array.isArray(this.settings.cli_args)) {
      return super.setCliArgs();
    }

    if (typeof this.settings.cli_args == 'object') {
      Object.keys(this.settings.cli_args).forEach(key => {
        let property = '';
        if (key.indexOf('-D') !== 0) {
          property += '-D';
        }
        property += `${key}=${this.settings.cli_args[key]}`;

        this.cliArgs.unshift(property);
      });
    }
  }

  createProcess() {
    Logger.info(`Starting Selenium Server on port ${this.settings.port}...`);

    this.cliArgs.push(
      '-jar', this.settings.server_path,
      '-port', this.settings.port);

    this.process = child_process.spawn('java', this.cliArgs, SeleniumServer.spawnOptions);

    this.checkProcessTimeout = setTimeout(() => {
      if (!this.resolved) {
        Logger.error('Timeout while waiting for Selenium Server to start.');
        this.stop();
      }
    }, SeleniumServer.defaultGlobalStartTimeout);

    return this;
  }

  onError(err) {
    if (err.code == 'ENOENT') {
      console.error(`\nAn error occurred while trying to start ${this.serviceName}:`);
    }

    console.error(err);

    process.nextTick(() => {
      this.stop();
    });
  }

  onClose() {
    if (this.checkProcessTimeout) {
      clearTimeout(this.checkProcessTimeout);
    }

    Logger.info(`${this.serviceName} process finished.`);
  }

  checkProcessStarted() {
    if (this.pollStarted) {
      return this;
    }

    this.pollStarted = true;
    if (this.initialCheckProcessDelay) {
      setTimeout(this.pingStatus.bind(this), this.initialCheckProcessDelay);
    } else {
      this.pingStatus();
    }

    return this;
  }

  pingStatus() {
    const http = require('http');

    return http.get({
      host: this.settings.host,
      port: this.settings.port,
      path: SeleniumServer.STATUS_ENDPOINT
    }, response => {
      response.setEncoding('utf8');
      let rawData = '';

      response.on('data', chunk => {
        rawData += chunk;
      });

      response.on('end', () => {
        if (response.statusCode === 200) {
          let elapsedTime = new Date() - this.startTime;
          Logger.info(`${this.serviceName} up and running on port ${this.settings.port} with pid: ${this.process.pid} (${elapsedTime}ms).`);

          process.nextTick(() => {
            this.promiseStarted.resolve();
          });

          return;
        }

        if (this.statusPingTries < SeleniumServer.maxStatusPollTries) {
          this.statusPingTries++;
          setTimeout(this.pingStatus.bind(this), SeleniumServer.statusPollInterval);
        } else {
          this.promiseStarted.reject(this.createError(`Timeout while trying to connect to ${this.serviceName} on port ${this.settings.port}.`));
        }
      });
    });
  }
}

module.exports = SeleniumServer;