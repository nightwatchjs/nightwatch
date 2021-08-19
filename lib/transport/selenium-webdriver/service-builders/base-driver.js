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

  get requiresDriverBinary() {
    return true;
  }

  static get DEFAULT_HOST() {
    return 'localhost';
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

  get defaultPort() {
    return undefined;
  }

  constructor(settings) {
    this.settings = settings;
    this.process = null;
    this.output = '';
    this.error_out = '';
    this.cliArgs = [];
    this.processCreated = false;
    this.processExited = false;

    this.hostname = this.settings.webdriver.host || BaseDriver.DEFAULT_HOST;
    this.port = this.settings.webdriver.port || this.defaultPort;

    if (!this.settings.webdriver.server_path && this.requiresDriverBinary) {
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

  setCliArgs(args) {
    const {cli_args} = this.settings.webdriver;
    const cliArgs = Array.isArray(args) ? args : cli_args;

    if (Array.isArray(cliArgs)) {
      cliArgs.forEach(item => {
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

    if (code === null || code === undefined) {
      code = 0;
    }

    this.processExited = true;

    if (code > 0) {
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
      // eslint-disable-next-line no-console
      console.warn('Please check that the "webdriver.server_path" config property is set correctly.\n');
    }

    process.nextTick(() => this.stop());
  }

  onClose() {
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
    const {default_path_prefix, server_path} = this.settings.webdriver;
    const {hostname, port} = this;
    let serverPathLog = '';
    let portNumberLog = '';

    if (server_path) {
      serverPathLog = `\n server_path=${server_path}...`;
    }

    if (port) {
      portNumberLog = ` on port ${port}`;
    }

    Logger.info(`Starting ${this.serviceName}${portNumberLog}${serverPathLog}`);

    if (this.needsSinkProcess()) {
      await this.createSinkProcess();
      this.service.setStdio(['pipe', this.process.stdin, this.process.stdin]);
    }

    if (port) {
      this.service.setPort(port);
    }

    if (hostname) {
      this.service.setHostname(hostname);
    }

    if (default_path_prefix) {
      this.service.setPath(default_path_prefix);
    }
  }

  async init(options = {}) {
    this.processExited = false;
    this.stopped = false;
    this.processCreated = false;
    this.startTime = new Date();

    this.setCliArgs();

    try {
      await this.createService(options);
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
}

module.exports = BaseDriver;
