const path = require('path');
const {SeleniumServer, DriverService} = require('selenium-webdriver/remote');
const {isObject, isNullOrEmpty, isDefined, getFreePort} = require('../../../utils');
const BaseService = require('./base-service.js');

class SeleniumServer4 extends DriverService {
  constructor(jar, opt_options) {
    const options = opt_options || {};
    const {command = 'standalone', jvmArgs, args} = options;
    let combinedArgs = jvmArgs.concat('-jar', jar, command);

    const port = options.port;
    if (!args.includes('--port')) {
      args.unshift('--port', port);
    }

    combinedArgs = combinedArgs.concat(args);

    let java = 'java';
    if (process.env['JAVA_HOME']) {
      java = path.join(process.env['JAVA_HOME'], 'bin/java');
    }

    super(java, {
      loopback: options.loopback,
      port,
      args: combinedArgs,
      path: '/wd/hub',
      env: options.env,
      stdio: options.stdio
    });
  }
}

class SeleniumServiceBuilder extends BaseService {
  static get serviceName() {
    return 'Selenium Server';
  }

  static get defaultPort() {
    return 4444;
  }

  get npmPackageName() {
    return '@nightwatch/selenium-server';
  }

  get outputFile() {
    return this._outputFile + '_selenium-server.log';
  }

  get defaultPort() {
    return SeleniumServiceBuilder.defaultPort;
  }

  get serviceName() {
    return 'Selenium Server';
  }

  get serviceDownloadUrl() {
    return 'https://selenium.dev/download/';
  }

  get downloadMessage() {
    return `download the selenium server jar from ${this.serviceDownloadUrl}, \n and set ` +
      '"selenium.server_path" config option to point to the jar file.';
  }

  static parseCliArgs(settings) {
    const {cli_args, jvmArgs} = settings;
    const cliArgs = jvmArgs || cli_args;

    if (Array.isArray(cliArgs)) {
      return super.setCliArgs(cliArgs);
    }

    const parsedJvmArgs = [];
    const parsedCliArgs = [];

    if (isObject(cliArgs)) {
      Object.keys(cliArgs).forEach(key => {

        const isEmptyValue = isNullOrEmpty(cliArgs[key]);
        const isJvmArg = !key.startsWith('-');

        const property = isJvmArg ? `-D${key}` : key;
          
        if (isJvmArg) {

          const finalArgument = isEmptyValue ? property : `${property}=${cliArgs[key]}`; 
          parsedJvmArgs.unshift(finalArgument);
          
        } else {
        
          if (!isEmptyValue) { 
            parsedCliArgs.unshift(cliArgs[key]);
          }; 
          parsedCliArgs.unshift(property);
        
        }
      });
    }

    return {parsedCliArgs, parsedJvmArgs};
  }

  setCliArgs() {
    const {parsedCliArgs, parsedJvmArgs} = SeleniumServiceBuilder.parseCliArgs(this.settings.selenium);
    this.jvmArgs = parsedJvmArgs;
    this.cliArgs.unshift(...parsedCliArgs);
  }

  usingSelenium4() {
    const {command, server_path} = this.settings.webdriver;

    return isDefined(command) && !server_path.includes('selenium-server-standalone-3.');
  }

  /**
   * @param {Capabilities} opts
   * @returns {Promise<void>}
   */
  async createService(opts = {}) {
    const {port} = this;
    const options = new SeleniumServer.Options();
    options.port = port || await getFreePort();
    let {server_path, command} = this.settings.webdriver;

    let commandStr = '';
    if (command) {
      commandStr = ` in ${command} mode `;
    }
    let serverPathStr = server_path.split(path.sep).pop();
    const introMsg = `Starting Selenium Server [${serverPathStr}] on port ${options.port}${commandStr}...`;

    if (opts.showSpinner) {
      opts.showSpinner(`${introMsg}\n\n`);
    } else {
      // eslint-disable-next-line
      console.info(introMsg);
    }

    // TODO: read the log_path and add it to cliArgs
    options.args = this.cliArgs;
    options.jvmArgs = this.jvmArgs;

    if (this.hasSinkSupport() && this.needsSinkProcess()) {
      this.createSinkProcess();
      options.stdio = ['pipe', this.process.stdin, this.process.stdin];
    }

    let Constructor = SeleniumServer;
    if (this.usingSelenium4()) {
      options.command = command;
      Constructor = SeleniumServer4;
    }

    this.service = new Constructor(server_path, options);

    return this.service.start();
  }
}

module.exports = SeleniumServiceBuilder;
