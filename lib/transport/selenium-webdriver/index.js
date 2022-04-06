const ora = require('ora');
const {Builder, Browser, error} = require('selenium-webdriver');

const Actions = require('./actions.js');
const SeleniumCapabilities = require('./options.js');
const {Logger, isObject} = require('../../utils');
const httpClient = require('./httpclient.js');
const Session = require('./session.js');
const BaseTransport = require('../');
const {colors} = Logger;
const {isErrorResponse, checkLegacyResponse, throwDecodedError, WebDriverError} = error;

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

  async createDriverService({options, moduleKey}) {
    try {
      this.driverService = new this.ServiceBuilder(this.settings);

      moduleKey = this.settings.webdriver.log_file_name || moduleKey || '';

      await this.driverService.setOutputFile(moduleKey).init(options);
    } catch (err) {
      this.showConnectSpinner(colors.red(`Failed to start ${this.serviceName}.`), 'warn');

      throw err;
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

  async createSession({argv, moduleKey}) {
    const startTime = new Date();
    const {host, port, start_process} = this.settings.webdriver;
    const portStr = port ? `port ${port}` : 'auto-generated port';
    const options = this.createSessionOptions(argv);

    if (start_process) {
      if (this.usingSeleniumServer) {
        options.showSpinner = (msg) => {
          this.showConnectSpinner(msg);
        };
      } else {
        this.showConnectSpinner(`Starting ${this.serviceName} on ${portStr}...\n`);
      }

      await this.createDriverService({options, moduleKey});
    } else {
      this.showConnectSpinner(`Connecting to ${host} on ${portStr}...\n`);
    }

    try {
      this.driver = await this.createDriver({options});
    } catch (err) {
      const error = this.handleConnectError(err);
      this.showConnectSpinner(colors.red(`Failed to connect to ${this.serviceName} on ${host} with ${portStr}.`), 'warn');

      throw error;
    }

    const session = new Session(this.driver);
    const sessionExports = await session.exported();
    const {sessionInfo, sessionId, capabilities, elementKey} = sessionExports;

    this.__elementKey = elementKey;
    await this.showConnectInfo({startTime, host, port, start_process, sessionInfo});

    return {
      sessionId,
      capabilities
    };
  }

  ////////////////////////////////////////////////////////////////////
  // Output related
  ////////////////////////////////////////////////////////////////////
  async showConnectInfo({startTime, port, host, start_process, sessionInfo}) {
    this.showConnectSpinner(`Connected to ${colors.stack_trace(start_process ? this.serviceName : host)} on port ${colors.stack_trace(port)} ${colors.stack_trace('(' + (new Date() - startTime) + 'ms)')}.`);

    if (this.outputEnabled) {
      const {platform, browserVersion, platformVersion, browserName} = sessionInfo;
      // eslint-disable-next-line no-console
      console.info(`  Using: ${colors.light_blue(browserName)} ${colors.brown('(' + (browserVersion) + ')')} on ${colors.cyan(platform.toUpperCase() + (platformVersion ? (' (' + platformVersion + ')') : ''))}.\n`);
    }
  }

  showConnectSpinner(msg, method = 'info') {
    if (!this.outputEnabled) {
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

  handleConnectError(err) {
    err.reportShown = true;
    const errMsg = `An error occurred while creating a new ${this.serviceName} session:`;

    switch (err.code) {
      case 'ECONNREFUSED':
        err.sessionCreate = true;
        err.message = `${errMsg} ${err.message.replace('ECONNREFUSED connect ECONNREFUSED', 'Connection refused to')}. If the Webdriver/Selenium service is managed by Nightwatch, check if "start_process" is set to "true".`;
        break;
      default:
        err.message = `${errMsg} [${err.name}] ${err.message}`;
    }

    err.showTrace = false;
    if (!err.detailedErr && this.driverService) {
      const logPath = this.driverService.getOutputFilePath();
      err.detailedErr = ` Verify if ${this.serviceName} is configured correctly; using:\n  ${this.driverService.getSettingsFormatted()}\n`;
      err.extraDetail = (logPath ? `\n  More info might be available in the log file: ${logPath}` : `\n  Set webdriver.log_path in your Nightwatch config to retrieve more logs from ${this.serviceName}.`);
    }

    return err;
  }

  isResultSuccess(result = {}) {
    return !(
      (result instanceof Error) ||
      (result.error instanceof Error) ||
      result.status === -1
    );
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
