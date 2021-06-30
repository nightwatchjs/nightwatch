const {Browser} = require('selenium-webdriver');

const BrowsersLowerCase = {
  chrome: Browser.CHROME,
  firefox: Browser.FIREFOX,
  safari: Browser.SAFARI,
  microsoftedge: Browser.EDGE,
  msedge: Browser.EDGE,
  edge: Browser.EDGE,
  ie: Browser.INTERNET_EXPLORER,
  'internet explorer': Browser.INTERNET_EXPLORER
};

module.exports = class TransportFactory {
  static usingSeleniumServer(settings) {
    if (!settings.selenium) {
      return false;
    }

    let {start_process, host} = settings.selenium;
    if (start_process) {
      return true;
    }

    if (!host) {
      host = settings.selenium_host || settings.seleniumHost;
    }

    return host && !settings.webdriver.start_process;
  }

  static usingBrowserstack(settings) {
    return settings.webdriver.host && settings.webdriver.host.endsWith('.browserstack.com');
  }

  static getBrowserName(nightwatchInstance) {
    const {settings, argv} = nightwatchInstance;
    let {browserName} = settings.desiredCapabilities;

    if (argv.chrome) {
      browserName = Browser.CHROME;
    } else if (argv.firefox) {
      browserName = Browser.FIREFOX;
    } else if (argv.safari) {
      browserName = Browser.SAFARI;
    } else if (argv.edge) {
      browserName = Browser.EDGE;
    } else {
      let browserLowerCaseName = browserName.toLowerCase();
      browserName = BrowsersLowerCase[browserLowerCaseName];
    }

    if (browserName) {
      return browserName;
    }

    const didYouMean = require('didyoumean');
    const browsersList = Object.values(Browser);
    const resultMeant = didYouMean(browserName, browsersList);

    throw new Error(`Unknown browser: "${browserName}"${resultMeant ? ('; did you mean "' + resultMeant + '"?') : ''}`);
  }

  static create(nightwatchInstance) {
    let Constructor;
    const {settings} = nightwatchInstance;
    const browserName = TransportFactory.getBrowserName(nightwatchInstance);
    const usingSeleniumServer = TransportFactory.usingSeleniumServer(settings);

    TransportFactory.adaptWebdriverSettings({settings, usingSeleniumServer, browserName});

    if (TransportFactory.usingBrowserstack(settings)) {
      Browserstack = require('./browserstack');

      return new Browserstack(nightwatchInstance, browserName);
    }

    if (settings.use_selenium_webdriver) {
      return TransportFactory.createForSeleniumWebdriver(nightwatchInstance, {browserName, usingSeleniumServer});
    }


    return new Constructor(nightwatchInstance);
  }

  static adaptWebdriverSettings({settings, usingSeleniumServer = false, browserName}) {
    if (settings.webdriver.port === 443 && settings.webdriver.ssl === undefined) {
      settings.webdriver.ssl = true;
    }

    if (settings.webdriver.use_legacy_jsonwire === undefined) {
      settings.webdriver.use_legacy_jsonwire = true;
    }

    if (!settings.webdriver.use_legacy_jsonwire && !usingSeleniumServer) {
      settings.capabilities = Object.assign({}, settings.desiredCapabilities);
    }
  }

  static createForSeleniumWebdriver(nightwatchInstance, {usingSeleniumServer, browserName}) {
    if (usingSeleniumServer) {
      const Selenium = require('./selenium-webdriver/selenium.js');

      return new Selenium(nightwatchInstance, browserName);
    }

    let Driver;
    switch (browserName) {
      case Browser.FIREFOX:
        Driver = require('./selenium-webdriver/firefox.js');
        break;

      case Browser.CHROME:
        Driver = require('./selenium-webdriver/chrome.js');
        break;

      case Browser.EDGE:
        Driver = require('./selenium-webdriver/edge.js');
        break;

      case Browser.SAFARI:
        Driver = require('./selenium-webdriver/safari.js');
        break;

      default:
        throw new Error(`Unrecognized browser: ${browserName}.`);
    }

    return new Driver(nightwatchInstance);
  }
};
