const {By, Builder, Capabilities, Browser, error} = require('selenium-webdriver');
const Element = require('../../element');
const Logging = require('./logging.js');
const Options = require('./options.js');
const WebdriverTransport = require('../webdriver/');
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

class SeleniumWebdriver extends WebdriverTransport {
  /**
   * @override
   * @constructor
   */
  get ServiceBuilder() {
    return null;
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

  get capabilities() {
    return this.__capabilities;
  }

  get driver() {
    if (!this.__driver) {
      return {};
    }

    return this.__driver;
  }

  set driver(value) {
    console.log("setting driver to", value);
    this.__driver = value;
  }

  get shouldStartDriverService() {
    return this.settings.webdriver.start_process;
  }

  constructor(nightwatchInstance, {isSelenium = false, browserName} = {}) {
    super(nightwatchInstance);

    this.__driver = null;
    this.__capabilities = this.createCapabilities();

    this.createHttpClient();

    if (browserName) {
      this.capabilities.setBrowserName(browserName);
    }

    this.elementKey = WebdriverTransport.WEB_ELEMENT_ID;
    // Logging.setupVerboseLogging({
    //   isSelenium
    // });
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
            const resp = new http.Response(statusCode, headers, body);

            resolve(resp);
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

    let {host = 'localhost', port = this.ServiceBuilder.defaultPort, ssl = false, default_path_prefix = ''} = this.settings.webdriver;

    return `${ssl ? 'https://' : 'http://'}${host}:${port}${default_path_prefix}`;
  }

  /**
   * @returns {Capabilities}
   */
  createCapabilities() {
    const capabilities = this.settings.capabilities || this.settings.desiredCapabilities;

    return (capabilities instanceof Capabilities) ? capabilities : new Capabilities(capabilities);
  }

  /**
   * @param argv
   */
  createOptions(argv) {
    let options;

    switch (this.capabilities.getBrowserName()) {
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
    if (this.capabilities.getProxy() && (options instanceof Capabilities) && options.setProxy) {
      const proxy = require('selenium-webdriver/proxy');
      options.setProxy(proxy.manual(this.capabilities.getProxy()));
    }
  }

  setBuilderOptions({builder, options}) {
    switch (this.capabilities.getBrowserName()) {
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

        break;

      case Browser.INTERNET_EXPLORER:

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
          .then(() => {});
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

  staleElementReference(result) {
    return result.error instanceof error.StaleElementReferenceError;
  }

  isResultSuccess(result) {
    return !((result instanceof Error) || (result.error instanceof Error) || result && result.status === -1);
  }

  async createSession(argv) {
    const options = this.createOptions(argv);

    let driverService;
    if (this.shouldStartDriverService) {
      driverService = await this.createDriverService({options});
    }

    this.driver = await this.createDriver({driverService, argv, options});

    const session = await this.driver.getSession();
    const sessionId = await session.getId();
    const capabilities = await session.getCapabilities();
    const executor = await this.driver.getExecutor();

    this.elementKey = executor.w3c ? WebdriverTransport.WEB_ELEMENT_ID : 'ELEMENT';

    return {
      sessionId,
      capabilities: SeleniumWebdriver.serializeCapabilities(capabilities)
    };
  }

  async closeSession(reason) {
    const data = await new Promise((resolve, reject) => {
      this.api.end(result => {
        resolve(result);
      });
    });

    this.sessionFinished(reason);

    return data;
  }
}

module.exports = SeleniumWebdriver;
