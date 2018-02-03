const child_process = require('child_process');
const Logger = require('../../util/logger.js');
const BaseWDServer = require('./base-wd-server.js');

class ChromeDriver extends BaseWDServer {
  static get OutputFile() {
    return 'chromedriver.log';
  }

  static get DEFAULT_PORT() {
    return 9515;
  }

  constructor(settings) {
    super(settings);

    this.outputFile = ChromeDriver.OutputFile;
    this.settings.port = this.settings.port || ChromeDriver.DEFAULT_PORT;
    this.settings.host = this.settings.host || ChromeDriver.DEFAULT_HOST;

    if (typeof this.settings.server_path !== 'string') {
      throw new Error('The path to the ChromeDriver binary is not set. Please set "webdriver.server_path" config option.');
    }
  }

  createProcess() {
    Logger.info(`Starting ChromeDriver on port ${this.settings.port}...`);

    this.process = child_process.spawn(this.settings.server_path, this.cliArgs, {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    this.checkProcessTimeout = setTimeout(() => {
      if (!this.resolved) {
        Logger.error('Timeout while waiting for ChromeDriver to start.');
        this.stop();
      }
    }, ChromeDriver.defaultGlobalStartTimeout);

    return this;
  }

  onError(err) {
    if (err.code == 'ENOENT') {
      console.error('\nAn error occurred while trying to start ChromeDriver:');
    }

    console.error(err);

    process.nextTick(() => {
      this.stop();
    });
  }

  onClose() {
    Logger.info('ChromeDriver process finished.');
  }

  createErrorMessage(code) {
    return `ChromeDriver process exited with code: ${code}`;
  }

  checkProcessStarted() {
    if (this.pollStarted) {
      return this;
    }

    this.pollStarted = true;
    this.pingStatus();

    return this;
  }

  pingStatus() {
    const http = require('http');

    return http.get({
      host: this.settings.host,
      port: this.settings.port,
      path: ChromeDriver.STATUS_ENDPOINT
    }, response => {
      response.setEncoding('utf8');
      let rawData = '';

      response.on('data', chunk => {
        rawData += chunk;
      });

      response.on('end', () => {
        if (response.statusCode === 200) {
          let elapsedTime = new Date() - this.startTime;
          Logger.info(`ChromeDriver up and running with on port ${this.settings.port} with pid: ${this.process.pid} (${elapsedTime}ms).`);

          return this.promiseStarted.resolve();
        }

        if (this.statusPingTries < ChromeDriver.maxStatusPollTries) {
          this.statusPingTries++;
          setTimeout(this.pingStatus.bind(this), ChromeDriver.statusPollInterval);
        } else {
          this.promiseStarted.reject(new Error(`Timeout while trying to connect to ChromeDriver on port ${this.settings.port}.`));
        }
      });
    });
  }
}

module.exports = ChromeDriver;