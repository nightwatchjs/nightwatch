const {By, Builder} = require('selenium-webdriver');
const Element = require('../../element');
const Logging = require('./logging.js');
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
  get DriverService() {
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

  get driver() {
    if (!this.__driver) {
      return {};
    }

    return this.__driver;
  }

  set driver(value) {
    this.__driver = value;
  }

  constructor(nightwatchInstance, {isSelenium = false} = {}) {
    super(nightwatchInstance);

    this.__driver = null;
    Logging.setupVerboseLogging({
      isSelenium
    });
  }

  /**
   * @override
   * @param settings
   * @param argv
   */
  createOptions(settings, argv) {}

  createDriver(opts) {
    const builder = new Builder();
    builder.disableEnvironmentOverrides();

    this.setBuilderOptions(builder, opts);

    return builder.build();
  }

  async createDriverService() {
    const service = new this.DriverService(this.settings);
    try {
      await service.init();
    } catch (err) {
      console.error(err)
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
    const driverService = await this.createDriverService();

    this.once('session:finished', () => {
      driverService.stop()
        .catch(err => {
          console.error(err);
        })
        .then(() => {});
    });

    const {service} = driverService;
    this.driver = await this.createDriver({service, argv});

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
