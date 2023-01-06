const {SeleniumServer, DriverService} = require('selenium-webdriver/remote');
const {getFreePort} = require('../../../utils');
const BaseService = require('./base-service.js');

class AppiumService extends DriverService {
  constructor(server_path, opt_options) {
    const options = opt_options || {};
    const {args, default_path_prefix} = options;

    const port = options.port;
    if (port !== AppiumServiceBuilder.defaultPort && !args.includes('--port')) {
      args.unshift('--port', port);
    }

    let cmd = 'node';
    if (server_path.startsWith('appium')) {
      cmd = server_path;
    } else {
      args.unshift(server_path);
    }

    super(cmd, {
      loopback: options.loopback,
      port,
      args,
      path: default_path_prefix,
      env: options.env,
      stdio: options.stdio
    });
  }
}

class AppiumServiceBuilder extends BaseService {
  static get serviceName() {
    return 'Appium Server';
  }

  static get defaultPort() {
    return 4723;
  }

  get npmPackageName() {
    return 'appium';
  }

  get outputFile() {
    return this._outputFile + '_appium-server.log';
  }

  get defaultPort() {
    return AppiumServiceBuilder.defaultPort;
  }

  get serviceName() {
    return 'Appium Server';
  }

  get downloadMessage() {
    return 'install Appium globally with "npm i -g appium" command, \n and set ' +
      '"selenium.server_path" config option to "appium".';
  }

  /**
   * @param {Capabilities} opts
   * @returns {Promise<void>}
   */
  async createService(opts = {}) {
    const {port} = this;
    const options = new SeleniumServer.Options();
    options.port = port || await getFreePort();
    const {server_path, default_path_prefix = '/wd/hub'} = this.settings.webdriver;

    const introMsg = `Starting Appium Server on port ${options.port}...`;

    if (opts.showSpinner) {
      opts.showSpinner(`${introMsg}\n\n`);
    } else {
      // eslint-disable-next-line
      console.info(introMsg);
    }

    // TODO: read the log_path and add it to cliArgs
    // above TODO is copied from ./selenium.js
    options.args = this.cliArgs;
    options.default_path_prefix = default_path_prefix;

    if (this.hasSinkSupport() && this.needsSinkProcess()) {
      this.createSinkProcess();
      options.stdio = ['pipe', this.process.stdin, this.process.stdin];
    }

    this.service = new AppiumService(server_path, options);

    return this.service.start();
  }
}

module.exports = AppiumServiceBuilder;
