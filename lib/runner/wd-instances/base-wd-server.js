const path = require('path');
const child_process = require('child_process');
const fs = require('fs');
const {Logger} = require('../../utils');

class BaseWDServer {
  get outputFile() {
    return 'webdriver-debug.log';
  }

  get serviceName() {
    return 'WebDriver';
  }

  get serviceDownloadUrl() {
    return '';
  }

  get defaultPort() {
    return 4444;
  }

  static get supportsConcurrency() {
    return false;
  }

  static get spawnOptions() {
    return {
      stdio: ['ignore', 'pipe', 'pipe']
    };
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
   * @return {number}
   */
  get processCreatedTimeoutMs() {
    return this.settings.process_create_timeout || 120000;
  }

  /**
   * Maximum number of ping status check attempts before returning an error
   *
   * @return {number}
   */
  get maxStatusPollTries() {
    return this.settings.max_status_poll_tries || 10;
  }

  /**
   * Interval (in ms) to use between 2 ping status checks
   *
   * @return {number}
   */
  get statusPollInterval() {
    return this.settings.status_poll_interval || 200;
  }

  /**
   * Time to wait (in ms) before starting to check the process if it's online
   *
   * @return {number}
   */
  get initialCheckProcessDelay() {
    return this.settings.check_process_delay || 100;
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
    this.statusCheckEndpoint = BaseWDServer.STATUS_ENDPOINT;
    this.sessionsEndpoint = BaseWDServer.SESSIONS_ENDPOINT;
    this.singleSessionEndpoint = BaseWDServer.SINGLE_SESSION_ENDPOINT;
    this.process = null;
    this.output = '';
    this.error_out = '';
    this.cliArgs = [];
    this.processCreated = false;
    this.exited = false;
    this.pollStarted = false;
    this.processCreatedTimeout = null;
    this.processStatusCheckTimeout = null;

    this.settings.port = String(this.settings.port || this.defaultPort);
    this.settings.host = this.settings.host || BaseWDServer.DEFAULT_HOST;

    if (!this.settings.server_path) {
      throw this.getStartupErrorMessage(this.errorMessages.binaryMissing);
    }

    this.promiseStarted = {
      resolve: null,
      reject: null
    };

    process.on('exit', () => this.stop());
  }

  setCliArgs() {
    if (Array.isArray(this.settings.cli_args)) {
      this.settings.cli_args.forEach(item => {
        if (typeof item == 'string') {
          this.cliArgs.push(item);
        }
      });
    }
  }

  createProcess() {
    Logger.info(`Starting ${this.serviceName} on port ${this.settings.port}...`);

    this.process = child_process.spawn(this.settings.server_path, this.cliArgs, BaseWDServer.spawnOptions);
    this.startProcessCreatedTimer();

    return this;
  }

  startProcessCreatedTimer() {
    this.processCreatedTimeout = setTimeout(() => {
      if (!this.processCreated) {
        Logger.error(`Timeout while waiting for ${this.serviceName} to start.`);
        this.stop();
      }
    }, this.processCreatedTimeoutMs);

    this.checkProcessStarted();
  }

  checkProcessStarted() {
    if (this.pollStarted) {
      return this;
    }

    this.pollStarted = true;

    if (this.initialCheckProcessDelay) {
      this.processStatusCheckTimeout = setTimeout(this.pingStatus.bind(this), this.initialCheckProcessDelay);
    } else {
      this.pingStatus();
    }

    return this;
  }

  pingStatus() {
    const http = require('http');

    const req = http.get({
      host: this.settings.host,
      port: this.settings.port,
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
          Logger.info(`${this.serviceName} up and running on port ${this.settings.port} with pid: ${this.process.pid} ` +
            `(${elapsedTime}ms).`);

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
        `on port ${this.settings.port}.`));
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
    if (this.exited) {
      return this;
    }

    if (this.processCreatedTimeout) {
      clearTimeout(this.processCreatedTimeout);
    }

    if (code === null || code === undefined) {
      code = 0;
    }

    this.exited = true;

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

    this.checkProcessStarted();
  }

  onStderr(data) {
    this.output += data.toString();
    this.error_out += data.toString();

    this.checkProcessStarted();
  }

  start() {
    let exitHandler = this.onExit.bind(this);

    this.exited = false;
    this.pollStarted = false;
    this.processCreated = false;
    this.startTime = new Date();

    this.setCliArgs();
    try {
      this.createProcess();
    } catch (err) {
      err.message = `Error while trying to create ${this.serviceName} process: ${err.message}.`;
      err.detailedErr = 'For more info about Node.js errors see https://nodejs.org/api/errors.html';

      return Promise.reject(err);
    }

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

  stop() {
    return this.writeLogFile()
      .then(_ => {
        if (!this.process || this.process.killed) {
          return;
        }

        try {
          this.process.kill();
        } catch (err) {
          return Promise.reject(err);
        }
      });
  }

  writeLogFile() {
    if (this.settings.log_path === false) {
      return Promise.resolve(true);
    }

    if (this.settings.log_path === undefined) {
      this.settings.log_path = '';
    }

    let filePath = path.resolve(path.join(this.settings.log_path, this.outputFile));

    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, this.output, function(err) {
        if (err) {
          Logger.error(`Cannot write log file to ${filePath}.`);
          Logger.warn(err);

          return resolve();
        }

        Logger.info(`Wrote log file to: ${filePath}.`);
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

module.exports = BaseWDServer;
