const path = require('path');
const child_process = require('child_process');
const fs = require('fs');
const Concurrency = require('../../../runner/concurrency');
const {Logger} = require('../../../utils');

class BaseDriver {
  get outputFile() {
    return 'webdriver-debug.log';
  }

  get serviceName() {
    return 'WebDriver';
  }

  get serviceDownloadUrl() {
    return '';
  }

  static get supportsConcurrency() {
    return false;
  }

  static get DEFAULT_HOST() {
    return 'localhost';
  }

  static get STATUS_ENDPOINT() {
    return '/status';
  }

  static get SESSIONS_ENDPOINT() {
    return '/sessions';
  }

  static get SINGLE_SESSION_ENDPOINT() {
    return '/session';
  }

  static get OPEN_SESSIONS_CHECK_TIMEOUT() {
    return 10000;
  }

  static get DELETE_OPEN_SESSION_TIMEOUT() {
    return 10000;
  }

  /**
   * Maximum number of ping status check attempts before returning an error
   *
   * @return {number}
   */
  get maxStatusPollTries() {
    return this.settings.webdriver.max_status_poll_tries || 10;
  }

  /**
   * Interval (in ms) to use between 2 ping status checks
   *
   * @return {number}
   */
  get statusPollInterval() {
    return this.settings.webdriver.status_poll_interval || 200;
  }

  get npmPackageName() {
    return null;
  }

  get errorMessages() {
    let binaryMissing = `The path to the ${this.serviceName} binary is not set.`;

    if (this.npmPackageName) {
      binaryMissing += '\n\n ' + Logger.colors.yellow(`You can either install ${this.npmPackageName} from NPM: \n\tnpm install ${this.npmPackageName} --save-dev\n\n`) + ' or ';
    } else {
      binaryMissing += '\n\n Please ';
    }

    binaryMissing += `download ${this.serviceName} from ${this.serviceDownloadUrl}, extract the archive and set ` +
      '"webdriver.server_path" config option to point to the binary file.\n';

    return {
      binaryMissing
    };
  }

  get errorOutput() {
    let errorOut = this.error_out.split('\n');

    return errorOut.reduce(function(prev, message) {
      if (prev.indexOf(message) < 0) {
        prev.push(message);
      }

      return prev;
    }, []).join('\n ');
  }

  constructor(settings) {
    this.settings = settings;
    this.statusPingTries = 0;
    this.statusCheckEndpoint = BaseDriver.STATUS_ENDPOINT;
    this.sessionsEndpoint = BaseDriver.SESSIONS_ENDPOINT;
    this.singleSessionEndpoint = BaseDriver.SINGLE_SESSION_ENDPOINT;
    this.process = null;
    this.output = '';
    this.error_out = '';
    this.cliArgs = [];
    this.processCreated = false;
    this.processExited = false;
    this.pollStarted = false;
    this.processCreatedTimeout = null;
    this.processStatusCheckTimeout = null;

    this.settings.webdriver.host = this.settings.webdriver.host || BaseDriver.DEFAULT_HOST;

    if (!this.settings.webdriver.server_path) {
      throw this.getStartupErrorMessage(this.errorMessages.binaryMissing);
    }

    this.promiseStarted = {
      resolve: null,
      reject: null
    };

    process.on('exit', () => this.stop());
    process.on('SIGINT', (code) => {
      this.stop().then(_ => {
        process.exit(code);
      });
    });

  }

  setCliArgs() {
    if (Array.isArray(this.settings.webdriver.cli_args)) {
      this.settings.webdriver.cli_args.forEach(item => {
        if (typeof item == 'string') {
          this.cliArgs.push(item);
        }
      });
    }
  }

  createSinkProcess() {
    const exitHandler = this.onExit.bind(this);

    this.process = child_process.spawn('cat', [], {
      env: process.env,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    this.process.unref();

    this.process.stdout.on('data', this.onStdout.bind(this));
    this.process.stderr.on('data', this.onStderr.bind(this));

    this.process.on('error', this.onError.bind(this));
    this.process.on('exit', exitHandler);
    this.process.on('close', this.onClose.bind(this));

    return new Promise((resolve, reject) => {
      this.promiseStarted.resolve = () => {
        this.process.removeListener('exit', exitHandler);

        this.processCreated = true;
        if (this.processCreatedTimeout) {
          clearTimeout(this.processCreatedTimeout);
        }

        resolve();
      };

      this.promiseStarted.reject = reject;
    });
  }

  pingStatus() {
    const http = require('http');
    const {host, port} = this.settings.webdriver;

    const req = http.get({
      host,
      port,
      path: this.statusCheckEndpoint
    }, response => {
      response.setEncoding('utf8');
      let rawData = '';

      response.on('data', chunk => {
        rawData += chunk;
      });

      response.on('end', () => {
        if (response.statusCode === 200 || response.statusCode === 404) {
          let elapsedTime = new Date() - this.startTime;
          Logger.info(`${this.serviceName} up and running on port ${port} (${elapsedTime}ms).`);

          process.nextTick(() => {
            this.promiseStarted.resolve();
          });

          return;
        }

        this.checkPingStatus();
      });
    });

    req.on('error', err => this.checkPingStatus());
  }

  checkPingStatus() {
    if (this.statusPingTries < this.maxStatusPollTries) {
      this.statusPingTries++;
      this.processStatusCheckTimeout = setTimeout(this.pingStatus.bind(this), this.statusPollInterval);
    } else {
      this.promiseStarted.reject(this.createError(`Timeout while trying to connect to ${this.serviceName} `+
        `on port ${this.settings.webdriver.port}.`));
    }
  }

  createErrorMessage(code) {
    return `${this.serviceName} process exited with code: ${code}`;
  }

  /**
   * @override
   * @param code
   */
  onExit(code) {
    if (this.processExited) {
      return this;
    }

    if (this.processCreatedTimeout) {
      clearTimeout(this.processCreatedTimeout);
    }

    if (code === null || code === undefined) {
      code = 0;
    }

    this.processExited = true;

    if (code > 0) {
      if (this.processStatusCheckTimeout) {
        clearTimeout(this.processStatusCheckTimeout);
      }

      let err = this.createError(null, code);
      err.detailedErr = this.error_out || this.output;
      this.promiseStarted.reject(err);
    }
  }

  /**
   * @override
   * @param err
   */
  onError(err) {
    let errMessage;
    if (err.code === 'ENOENT') {
      errMessage = `\nAn error occurred while trying to start ${this.serviceName}: cannot resolve path: "${err.path}".`;
    }

    Logger.error(errMessage || err);

    if (err.code === 'ENOENT') {
      console.warn('Please check that the "webdriver.server_path" config property is set correctly.\n');
    }

    process.nextTick(() => this.stop());
  }

  onClose() {
    if (this.processCreatedTimeout) {
      clearTimeout(this.processCreatedTimeout);
    }

    Logger.info(`${this.serviceName} process closed.`);
  }

  createError(message, code = 1) {
    if (!message && code) {
      message = this.createErrorMessage(code);
    }

    let err = new Error(message);
    err.code = code;
    err.errorOut = this.errorOutput;

    return err;
  }

  getStartupErrorMessage(message) {
    let err = this.createError(message);
    err.showTrace = false;

    return err;
  }

  onStdout(data) {
    this.output += data.toString();
  }

  onStderr(data) {
    this.output += data.toString();
    this.error_out += data.toString();
  }

  needsSinkProcess() {
    return !Concurrency.isChildProcess();
  }

  async createService() {
    const {port, host, default_path_prefix, server_path} = this.settings.webdriver;
    Logger.info(`Starting ${this.serviceName} on port ${port} \n server_path=${server_path}...`);

    if (this.needsSinkProcess()) {
      await this.createSinkProcess();
      this.service.setStdio(['pipe', this.process.stdin, this.process.stdin]);
    }

    if (port) {
      this.service.setPort(port);
    }

    if (host) {
      this.service.setHostname(host);
    }

    if (default_path_prefix) {
      this.service.setPath(default_path_prefix);
    }
  }

  async init() {
    this.processExited = false;
    this.stopped = false;
    this.pollStarted = false;
    this.processCreated = false;
    this.startTime = new Date();

    this.setCliArgs();

    try {
      await this.createService();
    } catch (err) {
      err.message = `Error while trying to create ${this.serviceName} process: ${err.message}.`;
      err.detailedErr = 'For more info about Node.js errors see https://nodejs.org/api/errors.html';

      return Promise.reject(err);
    }
  }

  async stop() {
    if (this.stopped) {
      return;
    }

    await this.writeLogFile();
    if (!this.process || this.process.killed) {
      return;
    }

    try {
      this.process.kill();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  writeLogFile() {
    let {log_path = ''} = this.settings.webdriver;
    if (log_path === false) {
      return Promise.resolve(true);
    }

    let filePath = path.resolve(path.join(log_path, this.outputFile));

    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, this.output, (err) => {
        if (err) {
          Logger.error(`Cannot write log file to ${filePath}.`);
          Logger.warn(err);
          this.stopped = true;

          return resolve();
        }

        Logger.info(`Wrote log file to: ${filePath}.`);
        this.stopped = true;
        resolve();
      });
    });
  }

  checkForOpenSessions() {
    return Promise.resolve();
  }

  closeOpenSessions() {
    return Promise.resolve();
  }
}

module.exports = BaseDriver;
