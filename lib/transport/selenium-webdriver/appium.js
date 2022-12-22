const path = require('path');
const {WebDriver} = require('selenium-webdriver');
const {Executor} = require('selenium-webdriver/http');
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
    return '4723';
  }

  get defaultPathPrefix() {
    return '/wd/hub';
  }

  createSessionOptions() {
    const options = this.desiredCapabilities;

    // break 'appium:options' to individual configs
    if (isObject(options['appium:options'])) {
      const appiumOptions = options['appium:options'];
      for (let key of Object.keys(appiumOptions)) {
        const value = appiumOptions[key];

        if (!key.startsWith('appium:')) {
          key = `appium:${key}`;
        }
        options[key] = value;
      }

      delete options['appium:options'];
    }

    const isRelativePath = (value) => {
      if (typeof value !== 'string') {
        return false;
      }

      return value.startsWith('./') || value.startsWith('../');
    };

    // convert relative paths to absolute paths
    for (const key of Object.keys(options)) {
      if (key.startsWith('appium:') && isRelativePath(options[key])) {
        options[key] = path.resolve(options[key]);
      }
    }

    // if `appium:chromedriverExecutable` is present and left blank,
    // assign the path of binary from `chromedriver` NPM package to it.
    if (options['appium:chromedriverExecutable'] === '') {
      const chromedriver = this.seleniumCapabilities.getChromedriverPath();
      if (chromedriver) {
        options['appium:chromedriverExecutable'] = chromedriver;
      }
    }

    return options;
  }

  createDriver({options = this.desiredCapabilities} = {}) {
    const httpClient = new http.HttpClient(this.getServerUrl());

    return WebDriver.createSession(new Executor(httpClient), options);
  }
};
