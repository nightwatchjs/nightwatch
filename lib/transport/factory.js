const {BrowserName} = require('../utils');

module.exports = class TransportFactory {
  static usingBrowserstack(settings) {
    return settings.webdriver.host && settings.webdriver.host.endsWith('.browserstack.com');
  }

  static create(nightwatchInstance) {
    let Constructor;
    const {settings} = nightwatchInstance;
    const usingSeleniumServer = settings.selenium &&
      (settings.selenium.start_process || !settings.webdriver.start_process && (settings.selenium_host || settings.selenium.host || settings.seleniumHost));

    TransportFactory.adaptWebdriverSettings(settings, usingSeleniumServer);

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

    const instance = new Constructor(nightwatchInstance);

    return instance;
  }

  static setSSLOption(settings) {
    if (settings.webdriver.port === 443 && settings.webdriver.ssl === undefined) {
      settings.webdriver.ssl = true;
    }
  }

  static adaptWebdriverSettings(settings, usingSeleniumServer = false) {
    const browserName = settings.desiredCapabilities.browserName.toLowerCase();

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
};
