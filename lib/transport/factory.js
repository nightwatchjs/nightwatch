const {Browser, Capabilities} = require('selenium-webdriver');

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

  static adaptWebdriverSettings({settings, usingSeleniumServer = false}) {
    if (!usingSeleniumServer && !(settings.capabilities instanceof Capabilities)) {
      settings.capabilities = Object.assign({}, settings.desiredCapabilities);
    }
  }

  static usingBrowserstack(settings) {
    return settings.webdriver.host && settings.webdriver.host.endsWith('.browserstack.com');
  }

  static getBrowserName(nightwatchInstance) {
    const {settings, argv = {}} = nightwatchInstance;
    const capabilities = settings.capabilities || settings.desiredCapabilities;
    if (capabilities instanceof Capabilities) {
      return capabilities.getBrowserName();
    }

    let {browserName} = settings.desiredCapabilities;

    // Better support for Appium, if the browserName has explicitly been set to null we can skip all further checks
    if (settings.selenium && settings.selenium.use_appium && !browserName) {
      return browserName;
    }

    // for backward compatibility
    if (browserName === null) {
      // TODO:
      // Deprecation warning: Setting browserName to null for running Appium tests has
      // now been deprecated and will be removed from future versions. Set `use_appium`
      // property to true in `selenium` config to run Appium tests.
      // 
      // put a warning here that if trying to connect to an Appium server,
      // just setting browserName=null will not work in the future.
      settings.selenium.use_appium = true;

      return browserName;
    }

    if (argv.chrome) {
      browserName = Browser.CHROME;
    } else if (argv.firefox) {
      browserName = Browser.FIREFOX;
    } else if (argv.safari) {
      browserName = Browser.SAFARI;
    } else if (argv.edge) {
      browserName = Browser.EDGE;
    } else if (BrowsersLowerCase[browserName && browserName.toLowerCase()]) {
      browserName = BrowsersLowerCase[browserName.toLowerCase()];
    } else {
      const didYouMean = require('didyoumean');
      const browsersList = Object.values(Browser);
      const resultMeant = didYouMean(browserName, browsersList);
  
      throw new Error(`Unknown browser: "${browserName}"${resultMeant ? ('; did you mean "' + resultMeant + '"?') : ''}`);
    }

    return browserName;
  }

  static create(nightwatchInstance) {
    const {settings} = nightwatchInstance;
    const browserName = TransportFactory.getBrowserName(nightwatchInstance);
    const usingSeleniumServer = TransportFactory.usingSeleniumServer(settings);

    TransportFactory.adaptWebdriverSettings({settings, usingSeleniumServer});

    return TransportFactory.createWebdriver(nightwatchInstance, {browserName, usingSeleniumServer});
  }

  static createWebdriver(nightwatchInstance, {usingSeleniumServer, browserName}) {
    if (TransportFactory.usingBrowserstack(nightwatchInstance.settings)) {
      const Browserstack = require('./selenium-webdriver/browserstack.js');

      return new Browserstack(nightwatchInstance, browserName);
    }

    if (usingSeleniumServer) {
      if (nightwatchInstance.settings.selenium.use_appium) {
        const Appium = require('./selenium-webdriver/appium.js');

        return new Appium(nightwatchInstance, browserName);
      }

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
