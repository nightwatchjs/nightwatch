const {WebDriver} = require('selenium-webdriver');
const {Executor} = require('selenium-webdriver/http');
const SeleniumServer = require('./selenium');
const http = require('selenium-webdriver/http');
const {isObject} = require('../../utils');


module.exports = class AppiumServer extends SeleniumServer {
  static get ServiceBuilder() {
    return require('./service-builders/appium.js');
  }

  get defaultBrowser() {
    return null;
  }

  get ServiceBuilder() {
    return AppiumServer.ServiceBuilder;
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
