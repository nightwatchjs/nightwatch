# Nightwatch.js

#### [Homepage](https://nightwatchjs.org) | [Getting Started](https://nightwatchjs.org/gettingstarted) | [Developer Guide](https://nightwatchjs.org/guide) | [API Reference](https://nightwatchjs.org/api) | [About](https://nightwatchjs.org/about)
***
Automated end-to-end testing framework powered by [Node.js](http://nodejs.org/) and using [W3C Webdriver](https://www.w3.org/TR/webdriver/) (formerly [Selenium](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol)).

Nightwatch is a complete and integrated solution for end-to-end testing of web applications and websites, and also for Node.js unit and integration testing. 

[![npm](https://img.shields.io/npm/v/nightwatch.svg)](https://www.npmjs.com/package/nightwatch)
[![Build Status](https://travis-ci.org/nightwatchjs/nightwatch.svg?branch=master)](https://travis-ci.org/nightwatchjs/nightwatch) 
[![Coverage Status](https://coveralls.io/repos/nightwatchjs/nightwatch/badge.svg?branch=master&service=github)](https://coveralls.io/github/nightwatchjs/nightwatch?branch=master)
[![npm package](https://img.shields.io/npm/dm/nightwatch.svg)](https://www.npmjs.com/package/nightwatch)
[![Twitter Follow](https://img.shields.io/twitter/follow/nightwatchjs.svg?style=social)](https://twitter.com/nightwatchjs)

[Changelog](https://github.com/nightwatchjs/nightwatch/releases) | [Mailing List](https://groups.google.com/forum/#!forum/nightwatchjs) | [nightwatch.js tag on StackOverflow](https://stackoverflow.com/questions/tagged/nightwatch.js)
***

## Nightwatch v1.2
We're delighted to announce the release of __Nightwatch v1.2__. Please see the [upgrade guide](https://github.com/nightwatchjs/nightwatch/wiki/Migrating-to-Nightwatch-1.0) if you are upgrading from a pre v1.0 version. 

### 1. Install Nightwatch

__From [NPM](https://npmjs.com/package/nightwatch):__
```sh
$ npm install nightwatch
```
- add `-g` if you wish to install Nightwatch globally on your system.

__From GitHub__:
```sh
$ git clone https://github.com/nightwatchjs/nightwatch.git
$ cd nightwatch
$ npm install
```

### 2. Download WebDriver

Nightwatch uses a [WebDriver](https://www.w3.org/TR/webdriver/) compatible server to control the browser. WebDriver is a W3C specification and industry standard which provides a platform and HTTP protocol to interact with a browser.
   
Nightwatch includes support for automatically managing the following services:
#### ChromeDriver 
- for running tests against the Chrome browser;
- download url: [https://sites.google.com/a/chromium.org/chromedriver/downloads](https://sites.google.com/a/chromium.org/chromedriver/downloads).

Starting with __version 75__, Chromedriver has [W3C Webdriver](https://www.w3.org/TR/webdriver1) protocol enabled by default. If you'd like to stick to the JSONWire for now adjust the `chromeOptions`:
```js
desiredCapabilities : {
  browserName : 'chrome',
  chromeOptions: {
    w3c: false
  }
}
```

#### GeckoDriver
- for running tests against the Mozilla Firefox browser;
- download url: [https://github.com/mozilla/geckodriver/releases](https://github.com/mozilla/geckodriver/releases).
 
#### Selenium Standalone Server 
- allows managing multiple browser configurations in one place and also to make use of the [Selenium Grid](https://github.com/SeleniumHQ/selenium/wiki/Grid2) service;
- the selenium server jar file `selenium-server-standalone-3.x.x.jar` can be downloaded from the Selenium releases page: https://selenium-release.storage.googleapis.com/index.html

> It's important to note that, while the Selenium Server was required with older Nightwatch versions (`v0.9` and prior), starting with version `1.0` Selenium is no longer necessary.

Specific WebDriver setup guides can be found on the [Docs website](http://nightwatchjs.org/gettingstarted/#browser-drivers-setup). Legacy Selenium drivers setup guides along with debugging instructions can be found on the [**Wiki**](https://github.com/nightwatchjs/nightwatch/wiki).

## Examples
Example tests are included in the [`examples`](https://github.com/nightwatchjs/nightwatch/tree/master/examples) folder which demonstrate the usage of several Nightwatch features. 

You can also check out the [nightwatch-website-tests](https://github.com/nightwatchjs/nightwatch-website-tests) repo for example tests against the [nightwatchjs.org](https://nightwatchjs.org) website.

A sample [`nightwatch.json`](https://github.com/nightwatchjs/nightwatch/blob/master/bin/nightwatch.json) config file can be found in `bin` folder.

## Nightwatch unit tests
The tests for Nightwatch are written using [Mocha](http://mochajs.org/).

To run the complete test suite:

```sh
$ npm test
```

To check test coverage, run the command:

```sh
$ npm run mocha-coverage
```
and then open the generated _coverage/index.html_ file in your browser.

## Support Nightwatch
Nightwatch is built by [@pineviewlabs](https://github.com/pineviewlabs/) - an independent software consultancy based in Oslo, Norway, with help from [our contributors](https://github.com/nightwatchjs/nightwatch/graphs/contributors). 

Please consider supporting Nightwatch by becoming a backer or sponsor on the [OpenCollective](https://opencollective.com/nightwatch/) platform.

[![Open Collective](https://opencollective.com/nightwatch/tiers/backers.svg?avatarHeight=60)](https://opencollective.com/nightwatch/contribute/tier/7349-backers)
