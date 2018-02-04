const path = require('path');
const fs = require('fs');
const http = require('http');
const Logger = require('../../util/logger.js');

class BaseWDServer {
  static get defaultOutputFile() {
    return 'webdriver-debug.log';
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
  static get maxStatusPollTries() {
    return 5;
  }

  /**
   * @return {number}
   */
  static get statusPollInterval() {
    return 100;
  }

  /**
   * @return {number}
   */
  static get defaultGlobalStartTimeout() {
    return 120000;
  }

  constructor(settings) {
    this.settings = settings;
    this.statusPingTries = 0;
    this.outputFile = BaseWDServer.defaultOutputFile;
    this.sessionsEndpoint = BaseWDServer.SESSIONS_ENDPOINT;
    this.singleSessionEndpoint = BaseWDServer.SINGLE_SESSION_ENDPOINT;
    this.process = null;
    this.output = '';
    this.error_out = '';
    this.cliArgs = [];
    this.resolved = false;
    this.exited = false;
    this.pollStarted = false;
    this.checkProcessTimeout = null;

    this.promiseStarted = {
      resolve: null,
      reject: null
    };

    process.on('exit', () => {
      this.stop();
    });
  }

  get errorOutput() {
    return this.error_out;
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

  /**
   * @override
   */
  createProcess() {}

  checkProcessStarted() {}

  createErrorMessage(exitCode) {
    return `WebDriver process exited with code: ${code}`;
  }

  /**
   * @override
   * @param code
   */
  onExit(code) {
    if (this.exited) {
      return this;
    }

    if (code === null || code === undefined) {
      code = 0;
    }

    this.exited = true;

    if (!this.resolved) {
      let err = new Error(this.createErrorMessage(code));
      err.code = code;
      this.promiseStarted.reject(err);
    }
  }

  /**
   * @override
   * @param err
   */
  onError(err) {
    console.error(err);
  }

  /**
   * @override
   */
  onClose() {}

  onStdout(data) {
    this.checkProcessStarted();

    this.output += data.toString();
  }

  onStderr(data) {
    this.output += data.toString();
    this.error_out += data.toString();
  }

  start() {
    let exitHandler = this.onExit.bind(this);

    this.exited = false;
    this.pollStarted = false;
    this.resolved = false;
    this.startTime = new Date();

    this.setCliArgs();
    this.createProcess();

    this.process.stdout.on('data', this.onStdout.bind(this));
    this.process.stderr.on('data', this.onStderr.bind(this));

    this.process.on('error', this.onError.bind(this));
    this.process.on('exit', exitHandler);
    this.process.on('close', this.onClose.bind(this));

    return new Promise((resolve, reject) => {
      this.promiseStarted.resolve = () => {
        this.process.removeListener('exit', exitHandler);
        this.resolved = true;
        if (this.checkProcessTimeout) {
          clearTimeout(this.checkProcessTimeout);
        }

        resolve();
      };

      this.promiseStarted.reject = reject;
    });
  }

  stop() {
    if (!this.process || this.process.killed) {
      return Promise.resolve(false);
    }

    try {
      this.process.kill();
    } catch (err) {
      return Promise.reject(err);
    }

    return this.writeLogFile();
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
    return new Promise((resolve, reject) => {
      let request = http.get({
        host: this.settings.host,
        port: this.settings.port,
        path: this.sessionsEndpoint
      }, response => {
        response.setEncoding('utf8');
        let rawData = '';

        response.on('data', chunk => {
          rawData += chunk;
        });

        response.on('end', () => {
          if (response.statusCode === 200) {
            try {
              let result = JSON.parse(rawData);
              resolve(result);
            } catch (err) {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });
      });

      request.on('error', () => {
        resolve(null);
      });

      request.setTimeout(BaseWDServer.OPEN_SESSIONS_CHECK_TIMEOUT, () => {
        request.abort();
        resolve(null);
      });
    });
  }

  closeOpenSessions(sessions) {
    let promises = [];

    sessions.forEach(session => {
      promises.push(new Promise((resolve, reject) => {
        let request = http.request({
          method: 'DELETE',
          host: this.settings.host,
          port: this.settings.port,
          path: `${this.singleSessionEndpoint}/${session.id}`
        }, response => {
          response.setEncoding('utf8');
          let rawData = '';

          response.on('data', chunk => {
            rawData += chunk;
          });

          response.on('end', () => {
            Logger.info(`Forcefully closed open session with ID: ${session.id}.`);

            resolve();
          });
        });

        request.on('error', () => {
          Logger.warn(`Failed to forcefully close open session with ID: ${session.id}.`);

          resolve();
        });

        request.setTimeout(BaseWDServer.DELETE_OPEN_SESSION_TIMEOUT, () => {
          request.abort();
          Logger.warn(`Time out while trying to forcefully close open session with ID: ${session.id}.`);

          resolve();
        });

        request.end();
      }));
    });

    return Promise.all(promises);
  }
}

module.exports = BaseWDServer;