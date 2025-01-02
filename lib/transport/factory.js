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
  static createSeleniumService(cliRunner) {
    const usingAppium = cliRunner.test_settings.selenium.use_appium;

    const Server = usingAppium
      ? require('./selenium-webdriver/appium.js')
      : require('./selenium-webdriver/selenium.js');

    cliRunner.seleniumService = Server.createService(cliRunner.test_settings);
    cliRunner.test_settings.selenium['[_started]'] = true;

    return cliRunner.seleniumService.init();
  }

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

  static usingBrowserstackTurboScale(settings) {
    return settings.webdriver.host && (settings.webdriver.host.endsWith('.browserstack-ats.com') || settings.webdriver.host.startsWith('browserstack-turboscale-grid'));
  }

  static usingBrowserstack(settings) {
    return settings.webdriver.host && (settings.webdriver.host.endsWith('.browserstack.com') || TransportFactory.usingBrowserstackTurboScale(settings));
  }

  static getBrowserName(nightwatchInstance) {
    const {settings, argv = {}} = nightwatchInstance;
    const capabilities = settings.capabilities || settings.desiredCapabilities;
    if (capabilities instanceof Capabilities) {
      return capabilities.getBrowserName();
    }

    let {browserName} = settings.desiredCapabilities;

    // Allow to use any browserName with Appium and BrowserStack.
    // Not supporting '--browserName' cli flag for both of these.
    const usingAppium = TransportFactory.usingSeleniumServer(settings) && settings.selenium.use_appium;
    const usingBrowserStack = TransportFactory.usingBrowserstack(settings);
    if (usingAppium || usingBrowserStack) {
      if (BrowsersLowerCase[browserName && browserName.toLowerCase()]) {
        browserName = BrowsersLowerCase[browserName.toLowerCase()];
      }

      return browserName;
    }

    // for backward compatibility
    if (browserName === null) {
      // eslint-disable-next-line no-console
      console.warn('DEPRECATED: Setting browserName=null for running Appium tests has been deprecated ' +
        'and will not be supported in future versions. Set `use_appium` property in `selenium` config to true ' +
        'in your Nightwatch configuration file to run Appium tests.');

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
      if (!browserName) {
        const AppAutomate = require('./selenium-webdriver/browserstack/appAutomate.js');

        return new AppAutomate(nightwatchInstance, browserName);
      }

      if (TransportFactory.usingBrowserstackTurboScale(nightwatchInstance.settings)) {
        const AutomateTurboScale = require('./selenium-webdriver/browserstack/automateTurboScale.js');

        return new AutomateTurboScale(nightwatchInstance, browserName);
      }

      const Automate = require('./selenium-webdriver/browserstack/automate.js');

      return new Automate(nightwatchInstance, browserName);
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
