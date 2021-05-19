const {BrowserName} = require('../utils');

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

  static create(nightwatchInstance) {
    let Constructor;
    const {settings} = nightwatchInstance;

    const browserName = settings.desiredCapabilities.browserName.toLowerCase();
    const usingSeleniumServer = TransportFactory.usingSeleniumServer(settings);

    TransportFactory.adaptWebdriverSettings({settings, usingSeleniumServer, browserName});

    if (settings.use_selenium_webdriver) {
      return TransportFactory.createForSeleniumWebdriver(nightwatchInstance, {browserName, usingSeleniumServer});
    }

    if (TransportFactory.usingBrowserstack(settings)) {
      Constructor = require('./browserstack');
    } else if (usingSeleniumServer && settings.selenium.version2) {
      // Legacy Selenium Server 2
      Constructor = require('./jsonwire/selenium2.js');
    } else if (usingSeleniumServer) {
      // Selenium Server 3
      Constructor = require('./selenium3');
    } else {
      // drivers using the legacy JSONWire protocol
      if (settings.webdriver.use_legacy_jsonwire) {
        Constructor = require('./jsonwire');
      } else {
        Constructor = require('./webdriver');
      }
    }

    return new Constructor(nightwatchInstance);
  }

  static setSSLOption(settings) {
    if (settings.webdriver.port === 443 && settings.webdriver.ssl === undefined) {
      settings.webdriver.ssl = true;
    }
  }

  static adaptWebdriverSettings({settings, usingSeleniumServer = false, browserName}) {
    TransportFactory.setSSLOption(settings);

    if (usingSeleniumServer && [BrowserName.CHROME, BrowserName.EDGE].includes(browserName)) {
      settings.selenium.version2 = true;

      return;
    }

    switch (browserName) {
      case BrowserName.SAFARI:
        TransportFactory.setOptionsForSafari(settings);
        break;

      case BrowserName.FIREFOX:
        TransportFactory.setOptionsForFirefox(settings);
        break;

      case BrowserName.CHROME: {
        TransportFactory.setOptionsForChrome(settings);
      }
    }

    if (settings.webdriver.use_legacy_jsonwire === undefined) {
      settings.webdriver.use_legacy_jsonwire = true;
    }

    if (!settings.webdriver.use_legacy_jsonwire && !usingSeleniumServer) {
      settings.capabilities = Object.assign({}, settings.desiredCapabilities);
    }
  }

  static setOptionsForChrome(settings) {
    const {chromeOptions = {}} = settings.desiredCapabilities;
    if (chromeOptions.w3c) {
      settings.webdriver.use_legacy_jsonwire = false;
    }
  }

  static setOptionsForSafari(settings) {
    if (settings.webdriver.start_process && settings.webdriver.use_legacy_jsonwire === undefined) {
      const SafariDriver = require('../runner/wd-instances/safaridriver.js');
      settings.webdriver.use_legacy_jsonwire = SafariDriver.useLegacyDriver;
    }
  }

  static setOptionsForFirefox(settings) {
    settings.webdriver.use_legacy_jsonwire = false;
  }

  static createForSeleniumWebdriver(nightwatchInstance, {usingSeleniumServer, browserName}) {
    if (nightwatchInstance.settings.webdriver.use_legacy_jsonwire) {
      console.warn('Legacy browser drivers are not supported anymore.');
    }

    if (usingSeleniumServer) {
      const Selenium = require('./selenium-webdriver/selenium.js');

      return new Selenium(nightwatchInstance);
    }

    let Driver;
    switch (browserName) {
      case 'firefox':
        Driver = require('./selenium-webdriver/firefox.js');
        break;
      case 'chrome':
        Driver = require('./selenium-webdriver/chrome.js');
        break;
    }

    return new Driver(nightwatchInstance);
  }
};
