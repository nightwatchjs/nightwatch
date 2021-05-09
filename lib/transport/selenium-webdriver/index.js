const {By, Builder, logging} = require('selenium-webdriver');
const Element = require('../../element');
const WebdriverTransport = require('../webdriver/');
const {Logger} = require('../../utils');

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

  static setupVerboseLogging() {
    const logger = logging.getLogger('webdriver.http');
    logger.setLevel(logging.Level.FINER);
    logger.addHandler(function(entry) {
      const {message, level, timestamp} = entry;
      try {

        const lines = message.split('\n');
        const containsData = lines.length > 1;

        if (containsData) {
          lines.shift();
          const header = lines.shift();
          const requestMethod = header.split(' ')[0];

          const accept = lines.shift();
          const separator = lines.shift();
          const requestData = lines.shift();
          const responseHeaders = [];

          let line = lines.shift();

          while (line !== '') {
            responseHeaders.push(line);
            line = lines.shift();
          }

          let responseData = lines.shift();
          try {
            responseData = JSON.parse(responseData);
          } catch (err) {
            Logger.error(err);
            responseData = {};
          }

          let requestDataLog = [''];
          let responseHeadersLog = [''];
          let responseToken = '';
          if (Logger.showRequestData()) {
            requestDataLog = ['   Request data:', JSON.parse(requestData), '\n'];
          }

          if (Logger.showResponseHeaders()) {
            responseHeadersLog = ['  Response headers:', responseHeaders];
            responseToken = '\n   Response data:';
          }
          const delimiter = '–––––––––––––––––––––––––––––––––––––––';
          Logger.info(`Request ${Logger.colors.light_cyan(header)}`, ...requestDataLog, ...responseHeadersLog, responseToken, responseData, Logger.colors.light_cyan(` ${delimiter}`));

        }
      } catch (handleErr) {
        Logger.error(handleErr);
      }
    });
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

  /**
   * @override
   * @param settings
   * @param argv
   */
  createOptions(settings, argv) {}

  createDriver(opts) {
    this.builder = new Builder();
    this.builder.disableEnvironmentOverrides();

    this.setBuilderOptions(opts);

    return this.builder.build();
  }

  createServiceBuilder(settings) {
    const serviceBuilder = new this.ServiceBuilder(settings);
    serviceBuilder.init();

    return serviceBuilder;
  }

  constructor(nightwatchInstance) {
    super(nightwatchInstance);

    this.__driver = null;
    SeleniumWebdriver.setupVerboseLogging();
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
    const serviceBuilder = this.createServiceBuilder(this.settings);

    this.once('session:finished', () => {
      serviceBuilder.stop()
        .catch(err => {
          console.error(err);
        })
        .then(() => {});
    });

    const {service} = serviceBuilder;
    this.driver = this.createDriver({service, argv});

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
