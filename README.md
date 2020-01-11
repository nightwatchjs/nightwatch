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

## Nightwatch v1.3
We're delighted to announce the release of __Nightwatch v1.3__. Please see the [upgrade guide](https://github.com/nightwatchjs/nightwatch/wiki/Migrating-to-Nightwatch-1.0) if you are upgrading from a pre v1.0 version. 

## Up &amp; Running in 2 Minutes:

#### 1. Install Nightwatch from NPM

```sh
$ npm install nightwatch --save-dev
```

#### 2. Install Browser Drivers:

##### Geckodriver (Firefox):
Geckodriver is the WebDriver service used to drive the [Mozilla Firefox Browser](https://www.mozilla.org/en-US/firefox/new/).

```sh
$ npm install geckodriver --save-dev
```

##### Chromedriver:
Chromedriver is the WebDriver service used to drive the [Google Chrome Browser](https://www.google.com/chrome/).
```sh
$ npm install chromedriver --save-dev
```

or install everything with one line:

```sh
$ npm i nightwatch geckodriver chromedriver --save-dev
```

#### 3. Run a Demo Test:

Nightwatch comes with an `examples` folder containing a few sample tests.

Below will run a basic test which opens the search engine [Ecosia.org](https://ecosia.org), searches for the term "nightwatch", and verifies if the term first result is the Nightwatch.js website.

```sh
$ ./node_modules/.bin/nightwatch node_modules/nightwatch/examples/tests/ecosia.js
```

__Windows users__ might need to run `node node_modules/.bin/nightwatch`.

---

## Manually Download Browser Drivers

Nightwatch uses a [WebDriver](https://www.w3.org/TR/webdriver/) compatible server to control the browser. WebDriver is a W3C specification and industry standard which provides a platform and HTTP protocol to interact with a browser.
   
Nightwatch includes support for automatically managing the following services:
### ChromeDriver 
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

### GeckoDriver
- for running tests against the Mozilla Firefox browser;
- download url: [https://github.com/mozilla/geckodriver/releases](https://github.com/mozilla/geckodriver/releases).
 
### Selenium Standalone Server 
- allows managing multiple browser configurations in one place and also to make use of the [Selenium Grid](https://github.com/SeleniumHQ/selenium/wiki/Grid2) service;
- the selenium server jar file `selenium-server-standalone-3.x.x.jar` can be downloaded from the Selenium releases page: https://selenium-release.storage.googleapis.com/index.html

> It's important to note that, while the Selenium Server was required with older Nightwatch versions (`v0.9` and prior), starting with version `1.0` Selenium is no longer necessary.

Specific WebDriver setup guides can be found on the [Docs website](http://nightwatchjs.org/gettingstarted/#browser-drivers-setup). Legacy Selenium drivers setup guides along with debugging instructions can be found on the [**Wiki**](https://github.com/nightwatchjs/nightwatch/wiki).

## Examples
Example tests are included in the [`examples`](https://github.com/nightwatchjs/nightwatch/tree/master/examples) folder which demonstrate the usage of several Nightwatch features. 

You can also check out the [nightwatch-website-tests](https://github.com/nightwatchjs/nightwatch-website-tests) repo for example tests against the [nightwatchjs.org](https://nightwatchjs.org) website.

## Nightwatch unit tests
The tests for Nightwatch are written using [Mocha](http://mochajs.org/).

#### 1. Clone the project
```sh
$ git clone https://github.com/nightwatchjs/nightwatch.git
$ cd nightwatch
$ npm install
```

#### 2. Run tests
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
