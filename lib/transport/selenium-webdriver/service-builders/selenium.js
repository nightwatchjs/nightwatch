const path = require('path');
const {SeleniumServer, DriverService} = require('selenium-webdriver/remote');
const {isObject, isUndefined, isDefined, getFreePort} = require('../../../utils');
const BaseService = require('./base-service.js');
const which = require('which');
const fs = require('fs').promises;
const {Logger} = require('../../../utils');

class SeleniumServer4 extends DriverService {

  /**
   * Constructs a new SeleniumServer4 instance.
   * @param {string} javaPath - Path to the Java executable.
   * @param {string} jar - Path to the Selenium server jar file.
   * @param {object} opt_options - Optional configuration options.
   */


  constructor(javaPath, jar, opt_options) {
    const options = opt_options || {};
    const {command = 'standalone', jvmArgs = [], args = []} = options;
    let combinedArgs = [...jvmArgs, '-jar', jar, command];

    const port = options.port || SeleniumServiceBuilder.defaultPort;
    if (!args.includes('--port')) {
      args.unshift('--port', port);
    }

    combinedArgs = combinedArgs.concat(args);

    super(javaPath, {
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
    return `${this._outputFile}_selenium-server.log`;
  }

  get serviceDownloadUrl() {
    return 'https://selenium.dev/download/';
  }

  get downloadMessage() {
    return `Download the Selenium server jar from ${this.serviceDownloadUrl}, \n and set ` +
      '"selenium.server_path" config option to point to the jar file.';
  }

  constructor(settings) {
    super();
    this.settings = settings;
    this.cliArgs = [];
    this.jvmArgs = [];
    this._javaPath = null;  // Cache for Java executable path
  }

  setCliArgs() {
    const {cli_args, jvmArgs} = this.settings.selenium;
    const cliArgs = jvmArgs || cli_args;

    if (Array.isArray(cliArgs)) {
      return super.setCliArgs(cliArgs);
    }

    this.jvmArgs = [];

    if (isObject(cliArgs)) {
      Object.keys(cliArgs).forEach(key => {
        if (!isUndefined(cliArgs[key])) {
          let property = '';
          const isJvmArg = !key.startsWith('-');

          if (isJvmArg) {
            property += '-D';
          }

          property += key;

          if (!cliArgs[key]) {
            this.cliArgs.unshift(property);

            return;
          }

          if (isJvmArg) {
            this.jvmArgs.unshift(`${property}=${cliArgs[key]}`);
          } else {
            this.cliArgs.unshift(property, cliArgs[key]);
          }
        }
      });
    }
  }


  /**
   * Determines if Selenium 4 is being used based on the configuration.
   * @returns {boolean}
   */

  usingSelenium4() {
    const {command, server_path} = this.settings.webdriver;

    return isDefined(command) && !server_path.includes('selenium-server-standalone-3.');
  }


  /**
   * Asynchronously finds the Java executable path.
   * @returns {Promise<string>} - Path to the Java executable.
   */

  async findJavaExecutable() {
    if (this._javaPath) {
      return this._javaPath;
    }

    if (process.env['JAVA_HOME']) {
      const javaExecutable = process.platform === 'win32' ? 'java.exe' : 'java';
      const javaPath = path.join(process.env['JAVA_HOME'], 'bin', javaExecutable);
      await this.checkExecutable(javaPath);
      this._javaPath = javaPath;

      return this._javaPath;
    }
    const javaPath = await which('java');
    this._javaPath = javaPath;

    return this._javaPath;

  }

  /**
   * Checks if the given file path is executable.
   * @param {string} filePath - Path to the file.
   * @returns {Promise<void>}
   */

  async checkExecutable(filePath) {
    await fs.access(filePath, fs.constants.X_OK);
  }


  /**
   * Creates and starts the Selenium Server service.
   * @param {object} opts - Options for service creation.
   * @returns {Promise<void>}
   */


  async createService(opts = {}) {
    //setting the cli args
    //finding the java executable
    const javaPath = await this.findJavaExecutable();
    //setting up the selenium server options
    const port = this.settings.selenium.port || SeleniumServiceBuilder.defaultPort;
    const options = {
      port: port || await getFreePort(),
      jvmArgs: this.jvmArgs,
      args: this.cliArgs,
      loopback: this.settings.selenium.loopback,
      env: this.settings.selenium.env,
      stdio: this.settings.selenium.stdio
    };

    const {server_path, command} = this.settings.webdriver;

    if (!server_path) {
      throw new Error(
        'Selenium server jar path is not specified. Please set the "selenium.server_path" configuration option.'
      );
    }

    //logging the startup message.
    let commandStr = '';
    if (command) {
      commandStr = ` in ${command} mode `;
    }
    const serverPathStr = path.basename(server_path);
    const introMsg = `Starting Selenium Server [${serverPathStr}] on port ${options.port}${commandStr}...`;

    if (opts.showSpinner) {
      opts.showSpinner(`${introMsg}\n\n`);
    } else {
      Logger.info(introMsg);
    }

    //handling the siunk processes if necessary.
    if (this.hasSinkSupport() && this.needsSinkProcess()) {
      this.createSinkProcess();
      options.stdio = ['pipe', this.process.stdin, this.process.stdin];
    }

    let Constructor = SeleniumServer;
    if (this.usingSelenium4()) {
      options.command = command;
      Constructor = SeleniumServer4;
    }

    //choosing the correct selenium service with the java path and server path.
    this.service = new Constructor(javaPath, server_path, options);

    await this.service.start();

  }
}

module.exports = SeleniumServiceBuilder;
