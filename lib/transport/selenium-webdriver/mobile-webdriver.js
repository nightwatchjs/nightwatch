const {WebDriver} = require('selenium-webdriver');
const {Executor} = require('selenium-webdriver/http');
const Selenium = require('./selenium');
const http = require('selenium-webdriver/http');


class Mobile extends Selenium {

  get defaultServerUrl() {
    return 'http://127.0.0.1:4723';
  }

  get defaultPathPrefix() {
    return '/wd/hub';
  }

  createDriver() {
    const httpClient = new http.HttpClient(this.getServerUrl());

    return WebDriver.createSession(new Executor(httpClient), this.initialCapabilities);
  }

}

module.exports = Mobile;
