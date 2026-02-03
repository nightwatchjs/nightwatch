const {WebDriver} = require('selenium-webdriver');
const {Executor} = require('selenium-webdriver/http');
const http = require('selenium-webdriver/http');
const SeleniumServer = require('./selenium.js');
const {isObject} = require('../../utils');
const {Logger} = require('../../utils');


class AppiumBaseServer extends SeleniumServer {
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

  createAppiumDriver({options}) {
    const startTime = new Date();
    const httpClient = new http.HttpClient(this.getServerUrl());
    const executor = new Executor(httpClient);
    
    const driverPromise = WebDriver.createSession(executor, options);
    
    // Add timing for driver creation if debug_timing is enabled
    if (this.settings.webdriver.debug_timing) {
      driverPromise.then(() => {
        const elapsed = new Date() - startTime;
        Logger.info(`[Timing] WebDriver.createSession: ${elapsed}ms`);
      }).catch(() => {
        // Ignore errors in timing
      });
    }
    
    return driverPromise;
  }
};

module.exports = AppiumBaseServer;
