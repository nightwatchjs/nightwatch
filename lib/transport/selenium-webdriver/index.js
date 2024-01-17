const ora = require('ora');
const {Builder, Browser, error} = require('selenium-webdriver');

const Actions = require('./actions.js');
const SeleniumCapabilities = require('./options.js');
const {Logger, isObject} = require('../../utils');
const {IosSessionNotCreatedError, AndroidConnectionError} = require('../../utils/mobile.js');
const httpClient = require('./httpclient.js');
const Session = require('./session.js');
const BaseTransport = require('../');
const {colors} = Logger;
const {isErrorResponse, checkLegacyResponse, throwDecodedError, WebDriverError} = error;
const {IosSessionErrors} = require('../errors');

let _driverService = null;
let _driver = null;

class Transport extends BaseTransport {
  /**
   * @param {Builder} builder
   * @param {Capabilities} options
   */
  static setBuilderOptions({builder, options}) {
    switch (options.getBrowserName()) {
      case Browser.CHROME:
        builder.setChromeOptions(options);
        break;

      case Browser.FIREFOX:
        builder.setFirefoxOptions(options);
        break;

      case Browser.SAFARI:
        builder.setSafariOptions(options);
        break;

      case Browser.EDGE:
        builder.setEdgeOptions(options);
        break;

      case Browser.OPERA:
        // TODO: implement
        break;

      case Browser.INTERNET_EXPLORER:
        builder.setIeOptions(options);
        break;
    }
  }

  static get driver() {
    return _driver;
  }

  static set driver(value) {
    _driver = value;
  }

  static get driverService() {
    return _driverService;
  }

  static set driverService(value) {
    _driverService = value;
  }


  /**
   * @override
   */
  get ServiceBuilder() {
    return null;
  }

  get defaultPort() {
    return this.ServiceBuilder ? this.ServiceBuilder.defaultPort : 4444;
  }

  get Actions() {
    return this.actionsInstance.actions;
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
  }

  get api() {
    return this.nightwatchInstance.api;
  }

  get settings() {
    return this.nightwatchInstance.settings;
  }

  get desiredCapabilities() {
    return this.settings.desiredCapabilities;
  }

  get defaultPathPrefix() {
    return '';
  }

  get outputEnabled() {
    return this.settings.output;
  }

  get usingSeleniumServer() {
    return this.settings.selenium && this.settings.selenium.start_process;
  }

  get shouldStartDriverService() {
    return this.settings.webdriver.start_process;
  }

  get serviceName() {
    return this.ServiceBuilder.serviceName;
  }

  get elementKey() {
    return this.__elementKey || Session.WEB_ELEMENT_ID;
  }

  get initialCapabilities() {
    return this.seleniumCapabilities.initialCapabilities;
  }

  get parallelMode() {
    return this.settings.testWorkersEnabled;
  }

  constructor(nightwatchInstance, {isSelenium = false, browserName} = {}) {
    super(nightwatchInstance);

    this.nightwatchInstance = nightwatchInstance;
    this.browserName = browserName;

    this.seleniumCapabilities = new SeleniumCapabilities({
      settings: this.settings,
      browserName
    });

    this.createHttpClient();
    this.createActions();
  }

  /**
   * @override
   */
  setBuilderOptions({options, builder}) {
    Transport.setBuilderOptions({options, builder});
  }

  createActions() {
    this.actionsInstance = new Actions(this);
    this.actionsInstance.loadActions();
  }

  createHttpClient() {
    const http = require('selenium-webdriver/http');
    http.HttpClient = httpClient(this.settings, http.Response);
  }

  getServerUrl() {
    if (this.shouldStartDriverService) {
      return this.defaultServerUrl;
    }

    return this.settings.webdriver.url;
  }

  ////////////////////////////////////////////////////////////////////
  // Session related
  ////////////////////////////////////////////////////////////////////
  async closeDriver() {
    if (this.driverService) {
      try {
        await this.driverService.stop();
        this.driverService = null;
        this.stopped = true;
      } catch (err) {
        Logger.error(err);
        err.displayed = true;

        throw err;
      }
    }
  }

  async sessionFinished(reason) {
    this.emit('session:finished', reason);

    await this.closeDriver();
  }

  async createDriverService({options, moduleKey, reuseBrowser = false}) {
    try {
      moduleKey = this.settings.webdriver.log_file_name || moduleKey || '';

      if (!this.shouldReuseDriverService(reuseBrowser)) {
        Transport.driverService = new this.ServiceBuilder(this.settings);
        await Transport.driverService.setOutputFile(reuseBrowser ? 'test' : moduleKey).init(options);
      }

      this.driverService = Transport.driverService;
    } catch (err) {
      this.showConnectSpinner(colors.red(`Failed to start ${this.serviceName}.`), 'warn');

      throw err;
    }
  }

  shouldReuseDriverService(reuseBrowser) {
    return (Transport.driverService && !Transport.driverService.stopped && reuseBrowser);
  }




  async getDriver({options, reuseBrowser = false}) {
    const value  = await this.shouldReuseDriver(reuseBrowser);
    if (value) {
      return Transport.driver;
    }

    Transport.driver = await this.createDriver({options});

    return Transport.driver;
  }


  async shouldReuseDriver(reuseBrowser) {
    if (!reuseBrowser || !Transport.driver) {
      return false;
    }
    try {
      await Transport.driver.getSession();

      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * @param {Capabilities} options
   * @returns {Builder}
   */
  createSessionBuilder(options) {
    const builder = new Builder();
    builder.disableEnvironmentOverrides();

    this.setBuilderOptions({builder, options});

    return builder;
  }

  createSessionOptions(argv) {
    return this.seleniumCapabilities.create(argv);
  }

  createDriver({options}) {
    const builder = this.createSessionBuilder(options);

    this.builder = builder;

    return builder.build();
  }

  async createSession({argv, moduleKey, reuseBrowser = false}) {
    const startTime = new Date();
    const {host, port, start_process} = this.settings.webdriver;
    const portStr = port ? `port ${port}` : 'auto-generated port';
    const options = await this.createSessionOptions(argv);

    if (start_process) {
      if (this.usingSeleniumServer) {
        options.showSpinner = (msg) => {
          this.showConnectSpinner(msg);
        };
      } else {
        this.showConnectSpinner(`Starting ${this.serviceName} on ${portStr}...\n`);
      }

      await this.createDriverService({options, moduleKey, reuseBrowser});
    } else {
      this.showConnectSpinner(`Connecting to ${host} on ${portStr}...\n`);
    }

    try {
      this.driver = await this.getDriver({options, reuseBrowser});

      const session = new Session(this.driver);
      const sessionExports = await session.exported();
      const {sessionInfo, sessionId, capabilities, elementKey} = sessionExports;

      this.__elementKey = elementKey;
      await this.showConnectInfo({startTime, host, port, start_process, sessionInfo});

      return {
        sessionId,
        capabilities,
        host,
        port
      };
    } catch (err) {
      const error = this.handleConnectError(err, host, port);
      this.showConnectSpinner(colors.red(`Failed to connect to ${this.serviceName} on ${host} with ${colors.stack_trace(portStr)}.`), 'warn');

      throw error;
    }
  }

  ////////////////////////////////////////////////////////////////////
  // Output related
  ////////////////////////////////////////////////////////////////////
  async showConnectInfo({startTime, port, host, start_process, sessionInfo}) {
    if (!this.parallelMode) {
      this.showConnectSpinner(`Connected to ${colors.stack_trace(start_process ? this.serviceName : host)} on port ${colors.stack_trace(port)} ${colors.stack_trace('(' + (new Date() - startTime) + 'ms)')}.`);
    }

    if (this.outputEnabled) {
      const {platform, browserVersion, platformVersion, browserName, appId} = sessionInfo;

      const appName = appId.split('.').pop() || browserName;
      const appVersion = browserVersion && ` (${browserVersion})`;
      const platName = platform.toUpperCase();
      const platVersion = platformVersion && ` (${platformVersion})`;

      // eslint-disable-next-line no-console
      console.info(`  Using: ${colors.light_blue(appName)}${colors.brown(appVersion)} on ${colors.cyan(platName + platVersion)}.\n`);
    }
  }

  showConnectSpinner(msg, method = 'info') {
    if (!this.outputEnabled || this.parallelMode) {
      return;
    }

    if (this.connectSpinner) {
      this.connectSpinner[method](msg);
    } else {
      this.connectSpinner = ora(msg).start();
    }
  }

  ////////////////////////////////////////////////////////////////////
  // Elements related
  ////////////////////////////////////////////////////////////////////
  getElementId(resultValue) {
    return resultValue[this.elementKey];
  }

  toElement(resultValue) {
    return {[this.elementKey]: resultValue};
  }

  mapWebElementIds(value) {
    if (Array.isArray(value)) {
      return value.reduce((prev, item) => {
        prev.push(this.getElementId(item));

        return prev;
      }, []);
    }

    return value;
  }

  /**
   * Helper method
   *
   * @param {String} protocolAction
   * @param {Object} executeArgs
   * @return {Promise}
   */
  executeProtocolAction(protocolAction, executeArgs) {
    if (isObject(protocolAction) && protocolAction.actionName) {
      const {actionName, args, sessionId = this.nightwatchInstance.sessionId} = protocolAction;

      return this.Actions.session[actionName]({
        args,
        sessionId,
        sessionRequired: true
      });
    }

    return this.Actions.session[protocolAction]({
      args: executeArgs,
      sessionId: this.nightwatchInstance.sessionId,
      sessionRequired: true
    });
  }

  ////////////////////////////////////////////////////////////////////
  // Error handling
  ////////////////////////////////////////////////////////////////////
  handleErrorResponse(result) {
    if (isErrorResponse(result)) {
      // will throw error if w3c response
      throwDecodedError(result);

      // will throw error if legacy response
      checkLegacyResponse(result);
    }
  }

  registerLastError(err, retryCount = 0) {
    this.lastError = err;
    this.retriesCount = retryCount;
  }

  getErrorMessage(result) {
    if (result instanceof Error) {
      return result.message;
    }

    return result.value && result.value.message;
  }

  handleConnectError(err, host, port) {
    const errMsg = `An error occurred while creating a new ${this.serviceName} session:`;

    switch (err.code) {
      case 'ECONNREFUSED':
        err.sessionCreate = true;
        err.message = `${errMsg} Connection refused to ${host}:${port}. If the Webdriver/Selenium service is managed by Nightwatch, check if "start_process" is set to "true".`;
        break;
      default:
        err.message = `${errMsg} [${err.name}] ${err.message}`;
    }

    if (!err.detailedErr && this.driverService) {
      const logPath = this.driverService.getOutputFilePath();
      err.detailedErr = ` Verify if ${this.serviceName} is configured correctly; using:\n  ${this.driverService.getSettingsFormatted()}\n`;
      err.extraDetail = (logPath ? `\n  More info might be available in the log file: ${logPath}` : `\n  Set webdriver.log_path in your Nightwatch config to retrieve more logs from ${this.serviceName}.`);

      if (err.message.includes('Failed to run adb command') || err.message.includes('no devices online')) {
        return new AndroidConnectionError(err);
      }

      if (IosSessionErrors[err.name] && this.api.isSafari() && this.api.isIOS()) {
        return new IosSessionNotCreatedError(err, this.desiredCapabilities);
      }
    }

    err.showTrace = false;
    err.reportShown = true;

    return err;
  }

  isResultSuccess(result = {}) {
    return !(
      (result instanceof Error) ||
      (result.error instanceof Error) ||
      result.status === -1
    );
  }

  getOutputFilePath() {
    return this.driverService.getOutputFilePath();
  }

  getErrorResponse(result) {
    return result instanceof Error ? result : result.error;
  }

  staleElementReference(result) {
    return result instanceof error.StaleElementReferenceError;
  }

  elementClickInterceptedError(result) {
    return result instanceof error.ElementClickInterceptedError;
  }

  invalidElementStateError(result) {
    return result instanceof error.InvalidElementStateError;
  }

  elementNotInteractableError(result) {
    return result instanceof error.ElementNotInteractableError;
  }

  invalidWindowReference(result) {
    return result instanceof error.NoSuchWindowError;
  }

  invalidSessionError(result) {
    return result instanceof error.NoSuchSessionError;
  }

  isRetryableElementError(result) {
    const errorResponse = this.getErrorResponse(result);

    if (errorResponse instanceof WebDriverError && errorResponse.name === 'WebDriverError') {
      const errors = this.getRetryableErrorMessages();

      return errors.some(item => errorResponse.message.includes(item));
    }

    return (
      this.staleElementReference(errorResponse) ||
      this.elementClickInterceptedError(errorResponse) ||
      this.invalidElementStateError(errorResponse) ||
      this.elementNotInteractableError(errorResponse)
    );
  }
}

module.exports = Transport;
