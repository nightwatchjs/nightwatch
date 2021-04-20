const Transport = require('../');
const TransportFactory = require('../factory.js');

class SeleniumWebdriverProtocol extends Transport {

  ////////////////////////////////////////////////////////////////////
  // Elements related
  ////////////////////////////////////////////////////////////////////
  formatCommandResponseData(result) {
    if (!result.value || typeof result.value != 'object') {
      return;
    }

    if (result['[[isNightwatch]]']) {
      delete result['[[isNightwatch]]'];

      return;
    }

    if (typeof result.value.stackTrace != 'undefined') {
      delete result.value.stackTrace;
    }
  }

  static create(nightwatchInstance) {
    const {settings} = nightwatchInstance;
    const browserName = settings.desiredCapabilities.browserName.toLowerCase();

    const usingSeleniumServer = settings.selenium &&
      (settings.selenium.start_process || !settings.webdriver.start_process &&
        (settings.selenium_host || settings.selenium.host || settings.seleniumHost));

    TransportFactory.adaptWebdriverSettings(settings, usingSeleniumServer);

    if (!usingSeleniumServer) {
      const builder = new Builder().forBrowser(browserName);

      return builder.build();
    }

    if (settings.webdriver.use_legacy_jsonwire) {
      return;
    }

    if (TransportFactory.usingBrowserstack(settings)) {
      return;
    }

    if (settings.selenium.version2) {
      // Legacy Selenium Server 2

      return;
    }

    if (usingSeleniumServer) {
      // Selenium Server 3

      return;
    }


  }
}

module.exports = SeleniumWebdriverProtocol;
