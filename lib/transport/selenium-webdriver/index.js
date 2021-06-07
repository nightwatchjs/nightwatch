const {By, Builder, Capabilities, Browser} = require('selenium-webdriver');
const Element = require('../../element');
const Logging = require('./logging.js');
const Options = require('./options.js');
const WebdriverTransport = require('../webdriver/');

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
    this.__driver = value;
  }

  get shouldStartDriverService() {
    return this.settings.webdriver.start_process;
  }

  constructor(nightwatchInstance, {isSelenium = false, browserName} = {}) {
    super(nightwatchInstance);

    this.__driver = null;
    this.__capabilities = this.createCapabilities();

    if (browserName) {
      this.capabilities.setBrowserName(browserName);
    }

    Logging.setupVerboseLogging({
      isSelenium
    });
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
      .addWindowSizeOption({options});

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
    console.log(result);

    return false;
  }

  isResultSuccess(result) {
    return !(result instanceof Error);
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
