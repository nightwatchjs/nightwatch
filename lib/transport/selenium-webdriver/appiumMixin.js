const {WebDriver} = require('selenium-webdriver');
const {Executor} = require('selenium-webdriver/http');
const http = require('selenium-webdriver/http');
const {isObject} = require('../../utils');

const AppiumMixin = {
  createAppiumDriver({options}) {
    const httpClient = new http.HttpClient(this.getServerUrl());

    return WebDriver.createSession(new Executor(httpClient), options);
  },

  extractAppiumOptions() {
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
  }
};

module.exports = AppiumMixin;
