const {Builder} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const Transport = require('../webdriver/');
const Actions = require('./actions.js');
const ServiceBuilder = require('./drivers/firefox.js');

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

  static createDriver(settings, argv) {
    const {webdriver = {}} = settings;
    let {options} = webdriver;

    if (!(options instanceof firefox.Options)) {
      options = createOptions(settings, argv);
    }

    if (argv.headless) {
      options.headless();
    }

    const serviceBuilder = new ServiceBuilder(webdriver);
    serviceBuilder.init();

    const builder = new Builder();

    return builder
      .forBrowser('firefox')
      .setFirefoxService(serviceBuilder.service)
      .setFirefoxOptions(options)
      .build();
  }

  createActions() {
    this.actionsInstance = new Actions(this);
    this.actionsInstance.loadActions();

    return this;
  }

  createSessionHandler() {}

  async createSession(argv) {
    this.driver = WebdriverProtocol.createDriver(this.settings, argv);
    const session = await this.driver.getSession();
    const sessionId = await session.getId();
    const capabilities = await session.getCapabilities();

    return {
      sessionId,
      capabilities: WebdriverProtocol.serializeCapabilities(capabilities)
    }
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
const createOptions = function(settings) {
  const options = new firefox.Options();
  const {desiredCapabilities, webdriver} = settings;
  const {alwaysMatch} = desiredCapabilities;
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

