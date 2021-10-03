const {By, Builder, Capabilities, Browser, error} = require('selenium-webdriver');
const Element = require('../../element');
const ora = require('ora');
const Options = require('./options.js');
const Transport = require('../');
const {Logger, isFunction, isObject} = require('../../utils');
const HttpRequest = require('../../http/request.js');

const Locators = {
  'css selector': 'css',
  'id': 'id',
  'link text': 'linkText',
  'name': 'name',
  'partial link text': 'partialLinkText',
  'tag name': 'tagName',
  'xpath': 'xpath',
  'className': 'className'
};

class SeleniumWebdriver extends Transport {
  /**
   * @override
   * @constructor
   */
  get ServiceBuilder() {
    return null;
  }

  get defaultPort() {
    return this.ServiceBuilder ? this.ServiceBuilder.defaultPort : 4444;
  }

  /**
   * @param {object|string} element
   * @return {*}
   */
  static createLocator(element) {
    if (!element) {
      throw new Error(`Missing element definition; got: "${element}".`);
    }

    if (element instanceof By) {
      return element;
    }

    if (element.by instanceof By) {
      return element.by;
    }

    if (typeof element != 'object' && typeof element != 'string') {
      throw new Error(`Invalid element definition type; expected string or object, but got: ${typeof element}.`);
    }

    let selector;
    let strategy;

    if (typeof element == 'object' && element.value && element.using) {
      selector = element.value;
      strategy = element.using;
    } else {
      selector = element;
    }

    const elementInstance = Element.createFromSelector(selector, strategy);

    return By[Locators[elementInstance.locateStrategy]](elementInstance.selector);
  }

  static serializeCapabilities(caps) {
    let ret = {};
    for (let key of caps.keys()) {
      let cap = caps.get(key);
      if (cap !== undefined && cap !== null) {
        ret[key] = cap;
      }
    }

    return ret;
  }

  get initialCapabilities() {
    return this.__capabilities;
  }

  get outputEnabled() {
    return this.settings.output;
  }

  get driver() {
    if (!this.__driver) {
      return {};
    }

    return this.__driver;
  }

  set driver(value) {
    this.__driver = value;
  }

  get shouldStartDriverService() {
    return this.settings.webdriver.start_process;
  }

  constructor(nightwatchInstance, {isSelenium = false, browserName} = {}) {
    super(nightwatchInstance);

    this.__driver = null;
    this.__capabilities = this.createInitialCapabilities();

    this.createHttpClient();

    if (browserName) {
      this.initialCapabilities.setBrowserName(browserName);
    }
    this.elementKey = Transport.WEB_ELEMENT_ID;
  }


  createHttpClient() {
    const url = require('url');
    const http = require('selenium-webdriver/http');
    const {settings} = this.nightwatchInstance;
    // TODO: handle agent and proxy arguments below

    http.HttpClient = class HttpClient {
      constructor(serverUrl, opt_agent, opt_proxy) {
        this.agent_ = opt_agent || null;
        //eslint-disable-next-line
        const options = url.parse(serverUrl);
        if (!options.hostname) {
          throw new Error('Invalid URL: ' + serverUrl);
        }
        this.proxyOptions_ = opt_proxy ? {} : null;

        const {hostname: host, port, pathname: path, protocol} = options;
        const {log_screenshot_data} = settings;

        this.options = {
          host,
          port: port ? Number(port) : (protocol === 'https' ? 443 : 80),
          path,
          addtOpts: {
            suppressBase64Data: !log_screenshot_data
          },
          use_ssl: protocol === 'https:'
        };
        this.errorTimeoutId = null;
      }

      /** @override */
      send(httpRequest) {
        const {method, data, path} = httpRequest;
        const headers = {};

        if (httpRequest.headers) {
          httpRequest.headers.forEach(function (value, name) {
            headers[name] = value;
          });
        }

        this.options.headers = headers;
        this.options.data = data;
        this.options.path = path;
        this.options.method = method;

        const request = new HttpRequest(this.options);

        return new Promise((resolve, reject) => {
          request.once('success', (data, response, isRedirect) => {
            const {statusCode, headers} = response;
            let body = '';
            if (data) {
              try {
                body = JSON.stringify(data);
              } catch (err) {
                // 
              }
            }

            if (data && data.error) {
              reject(data);
            } else {
              const resp = new http.Response(statusCode, headers, body);
              resolve(resp);
            }
          });

          request.on('error', (err) => {
            let {message, code} = err;

            // for connection reset errors, sometimes the error event gets fired multiple times
            if (this.errorTimeoutId) {
              clearTimeout(this.errorTimeoutId);
            }
            this.errorTimeoutId = setTimeout(() => {
              if (code) {
                message = code + ' ' + message;
              }

              const error = new Error(message);
              if (code) {
                error.code = code;
              }

              reject(error);
            }, 15);
          });

          request.send();
        });
      }
    };
  }

  getServerUrl() {
    if (this.shouldStartDriverService) {
      return this.defaultServerUrl;
    }

    return this.settings.webdriver.url;
  }

  /**
   * using instanceof here won't work since the object could have been created with another Capabilities class
   */
  static isCapabilitiesInstance(capabilities) {
    return isObject(capabilities) &&
      capabilities.map_ &&
      isFunction(capabilities.getBrowserName) &&
      capabilities.getBrowserName() !== '';
  }
  /**
   * Create an initial capabilities instance based on either the capabilities or desiredCapabilities
   *  setting from the nightwatch config
   *
   * @returns {Capabilities}
   */
  createInitialCapabilities() {
    let capabilities = this.settings.capabilities || this.settings.desiredCapabilities;
    if (isFunction(capabilities)) {
      capabilities = capabilities.call(this.settings);
    }

    if (capabilities instanceof Capabilities) {
      return capabilities;
    }

    return new Capabilities(capabilities);
  }

  /**
   * @param argv
   */
  createOptions(argv) {
    let options;

    switch (this.initialCapabilities.getBrowserName()) {
      case Browser.CHROME:
        options = Options.createChromeOptions(this.settings);
        break;

      case Browser.FIREFOX:
        options = Options.createFirefoxOptions(this.settings);
        break;

      case Browser.SAFARI:
        options = Options.createSafariOptions(this.settings);
        break;

      case Browser.EDGE:
        options = Options.createEdgeOptions(this.settings);
        break;

      case Browser.OPERA:

        break;

      case Browser.INTERNET_EXPLORER:

        break;
    }

    this
      .addHeadlessOption({options, argv})
      .addWindowSizeOption({options})
      .addProxyOption({options});

    return options;
  }

  addHeadlessOption({options, argv}) {
    if (argv && argv.headless && (options instanceof Capabilities) && options.headless) {
      options.headless();
    }

    return this;
  }

  addWindowSizeOption({options}) {
    if (this.settings.window_size && (options instanceof Capabilities) && options.windowSize) {
      options.windowSize(this.settings.window_size);
    }

    return this;
  }

  addProxyOption({options}) {
    if (this.initialCapabilities.getProxy() && (options instanceof Capabilities) && options.setProxy) {
      const proxy = require('selenium-webdriver/proxy');
      options.setProxy(proxy.manual(this.initialCapabilities.getProxy()));
    }
  }

  setBuilderOptions({builder, options}) {
    switch (this.initialCapabilities.getBrowserName()) {
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
        // TODO: implement
        break;
    }

    return this;
  }

  createDriver({driverService, options}) {
    const builder = new Builder();
    builder.disableEnvironmentOverrides();

    this.setBuilderOptions({builder, driverService, options});

    return builder.build();
  }

  async createDriverService({options}) {
    const service = new this.ServiceBuilder(this.settings);

    try {
      this.once('session:finished', () => {
        service.stop()
          .catch(err => {
            console.error(err);
          })
          .then(() => {
            this.stopped = true;
          });
      });
      await service.init(options);
    } catch (err) {
      console.error(err);
    }

    return service;
  }

  createActions() {
    const Actions = require('./actions.js');
    this.actionsInstance = new Actions(this);
    this.actionsInstance.loadActions();

    return this;
  }

  createSessionHandler() {}

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

  isResultSuccess(result = {}) {
    return !(
      (result instanceof Error) ||
      (result.error instanceof Error) ||
      result.status === -1
    );
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

  async createSession(argv) {
    this.options = this.createOptions(argv);

    const options = this.options;
    const {colors} = Logger;
    const {host, port, start_process} = this.settings.webdriver;
    const startTime = new Date();
    const portStr = port ? `port ${port}` : 'auto-generated port';

    let driverService;
    if (start_process) {
      this.showConnectSpinner(`Starting ${this.ServiceBuilder.serviceName} on ${portStr}...\n`);
      driverService = await this.createDriverService({options});
    } else {
      this.showConnectSpinner(`Connecting to ${host} on ${portStr}...\n`);
    }

    try {
      this.driver = await this.createDriver({driverService, argv, options});
    } catch (err) {
      const errMsg = 'An error occurred while retrieving a new session:';

      switch (err.code) {
        case 'ECONNREFUSED':
          err.sessionConnectionRefused = true;
          err.incrementErrorsNo = true;

          err.message = `${errMsg} ${err.message.replace('ECONNREFUSED connect ECONNREFUSED', 'Connection refused to')}. If the Webdriver/Selenium service is managed by Nightwatch, check if "start_process" is set to "true".`;
          break;
        default:
          err.message = `${errMsg} [${err.name}] ${err.message}`;
      }

      this.showConnectSpinner(colors.red(`Error connecting to ${host} on port ${port}.`), 'warn');

      throw err;
    }

    const session = await this.driver.getSession();
    const sessionId = await session.getId();
    const sessionCapabilities = await session.getCapabilities();

    this.showConnectSpinner(`Connected to ${colors.stack_trace(start_process ? this.ServiceBuilder.serviceName : host)} on port ${colors.stack_trace(port)} ${colors.stack_trace('(' + (new Date() - startTime) + 'ms)')}.`);

    if (this.outputEnabled) {
      const platform = sessionCapabilities.getPlatform() || '';
      const platformVersion = sessionCapabilities.get('platformVersion');
      const browserName = sessionCapabilities.getBrowserName();
      const browserVersion = sessionCapabilities.getBrowserVersion();
      // eslint-disable-next-line no-console
      console.info(`  Using: ${colors.light_blue(browserName)} ${colors.brown('(' + (browserVersion) + ')')} on ${colors.cyan(platform.toUpperCase() + (platformVersion ? (' (' + platformVersion + ')') : ''))}.\n`);
    }

    const executor = await this.driver.getExecutor();

    this.elementKey = executor.w3c ? Transport.WEB_ELEMENT_ID : 'ELEMENT';

    return {
      sessionId,
      capabilities: SeleniumWebdriver.serializeCapabilities(sessionCapabilities)
    };
  }
}

module.exports = SeleniumWebdriver;
