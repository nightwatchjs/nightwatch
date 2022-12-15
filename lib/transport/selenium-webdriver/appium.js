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

    return options;
  }

  createDriver({options = this.desiredCapabilities} = {}) {
    const httpClient = new http.HttpClient(this.getServerUrl());

    return WebDriver.createSession(new Executor(httpClient), options);
  }
};
