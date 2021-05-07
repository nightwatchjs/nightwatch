const {Builder, logging} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const Transport = require('../webdriver/');
const Actions = require('./actions.js');
const ServiceBuilder = require('./drivers/firefox.js');
const {Logger} = require('../../utils');

module.exports = class WebdriverProtocol extends Transport {
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

  static createOptions(settings, argv) {
    const {webdriver = {}} = settings;
    let {options} = webdriver;

    // either supply an existing firefox options object, or create a new one
    if (!(options instanceof firefox.Options)) {
      options = createFirefoxOptions(settings);
    }

    if (argv.headless) {
      options.headless();
    }

    return options;
  }

  static createDriver({options, service}) {
    const builder = new Builder();

    builder
      .disableEnvironmentOverrides()
      .forBrowser('firefox')
      .setFirefoxService(service)
      .setFirefoxOptions(options);

    return builder.build();
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

  static createServiceBuilder(settings) {
    const {webdriver} = settings;

    const serviceBuilder = new ServiceBuilder(webdriver);
    serviceBuilder.init();

    return serviceBuilder;
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

  constructor(nightwatchInstance) {
    super(nightwatchInstance);

    this.__driver = null;
    WebdriverProtocol.setupVerboseLogging();
  }


  createActions() {
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
    const options = WebdriverProtocol.createOptions(this.settings, argv);
    const serviceBuilder = WebdriverProtocol.createServiceBuilder(this.settings);

    this.once('session:finished', () => {
      serviceBuilder.stop()
        .catch(err => {
          console.error(err);
        })
        .then(() => {});
    });

    const {service} = serviceBuilder;
    this.driver = WebdriverProtocol.createDriver({options, service});

    const session = await this.driver.getSession();
    const sessionId = await session.getId();
    const capabilities = await session.getCapabilities();

    return {
      sessionId,
      capabilities: WebdriverProtocol.serializeCapabilities(capabilities)
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
};


/**
 * @param {object} settings
 * @return {firefox.Options}
 */
const createFirefoxOptions = function(settings) {
  const options = new firefox.Options();
  const {desiredCapabilities, webdriver} = settings;
  const {alwaysMatch = {}} = desiredCapabilities;
  const firefoxOptions = alwaysMatch['moz:firefoxOptions'] || desiredCapabilities['moz:firefoxOptions'] || {};
  if (firefoxOptions.args && firefoxOptions.args.length > 0) {
    options.addArguments(firefoxOptions.args);
  }

  if (firefoxOptions.extensions) {
    options.addExtensions(...firefoxOptions.extensions);
  }

  if (firefoxOptions.prefs) {
    Object.keys(firefoxOptions.prefs).forEach(key => {
      options.setPreference(key, firefoxOptions.prefs[key]);
    });
  }

  if (webdriver.firefox_binary || settings.firefox_binary) {
    options.setBinary(webdriver.firefox_binary || settings.firefox_binary);
  }

  if (webdriver.firefox_profile || settings.firefox_profile) {
    options.setProfile(webdriver.firefox_profile || settings.firefox_profile);
  }

  if (settings.windowSize) {
    options.windowSize(settings.windowSize);
  }

  return options;
};

