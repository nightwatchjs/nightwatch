const path = require('path');
const {WebDriver} = require('selenium-webdriver');
const {Executor} = require('selenium-webdriver/http');
const TransportFactory = require('../factory');
const SeleniumServer = require('./selenium');
const AppiumServiceBuilder = require('./service-builders/appium');
const http = require('selenium-webdriver/http');
const {isObject} = require('../../utils');


module.exports = class AppiumServer extends SeleniumServer {
  static startServer(settings) {
    const Options = require('./options.js');
    const opts = new Options({settings});
    opts.updateWebdriverPath();

    const appiumService = new AppiumServiceBuilder(settings);

    const outputFile = settings.webdriver.log_file_name || '';
    appiumService.setOutputFile(outputFile);

    return appiumService;
  }

  get defaultBrowser() {
    return null;
  }

  get ServiceBuilder() {
    return AppiumServiceBuilder;
  }

  get defaultServerUrl() {
    return 'http://127.0.0.1:4723';
  }

  get defaultPort() {
    return 4723;
  }

  get defaultPathPrefix() {
    return '/wd/hub';
  }

  createSessionOptions(argv) {
    // break 'appium:options' to individual configs
    if (isObject(this.desiredCapabilities['appium:options'])) {
      const appiumOptions = this.desiredCapabilities['appium:options'];
      for (let key of Object.keys(appiumOptions)) {
        const value = appiumOptions[key];

        if (!key.startsWith('appium:')) {
          key = `appium:${key}`;
        }
        this.desiredCapabilities[key] = value;
      }

      delete this.desiredCapabilities['appium:options'];
    }

    // if `appium:chromedriverExecutable` is present and left blank,
    // assign the path of binary from `chromedriver` NPM package to it.
    if (this.desiredCapabilities['appium:chromedriverExecutable'] === '') {
      const chromedriver = this.seleniumCapabilities.getChromedriverPath();
      if (chromedriver) {
        this.desiredCapabilities['appium:chromedriverExecutable'] = chromedriver;
      }
    }

    return super.createSessionOptions(argv) || this.desiredCapabilities;
  }

  createDriver({options = this.desiredCapabilities} = {}) {
    // If creating a session with BrowserStack Automate, use Selenium's session builder.
    if (TransportFactory.usingBrowserstack(this.settings) && this.productNamespace === 'automate') {
      return super.createDriver({options});
    }

    const httpClient = new http.HttpClient(this.getServerUrl());

    return WebDriver.createSession(new Executor(httpClient), options);
  }
};
