# Nightwatch

UI automated testing framework powered by [Node.js](http://nodejs.org/). It uses the [Selenium WebDriver API](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol).

[![Build Status](https://travis-ci.org/nightwatchjs/nightwatch.svg?branch=master)](https://travis-ci.org/nightwatchjs/nightwatch) [![NPM version](https://badge.fury.io/js/nightwatch.png)](http://badge.fury.io/js/nightwatch) [![Coverage Status](https://coveralls.io/repos/nightwatchjs/nightwatch/badge.svg?branch=master&service=github)](https://coveralls.io/github/nightwatchjs/nightwatch?branch=master)

***

#### [Homepage](http://nightwatchjs.org) | [Developer Guide](http://nightwatchjs.org/guide) | [API Reference](http://nightwatchjs.org/api) | [Changelog](https://github.com/nightwatchjs/nightwatch/releases)

### Selenium WebDriver standalone server
Nightwatch works with the Selenium standalone server so the first thing you need to do is download the selenium server jar file `selenium-server-standalone-2.x.x.jar` from the Selenium releases page:
**https://selenium-release.storage.googleapis.com/index.html**

### Install Nightwatch

Install Node.js and then:
```sh
$ git clone https://github.com/nightwatchjs/nightwatch.git
$ cd nightwatch
$ npm install
```

### Run tests
The tests for Nightwatch are written using [Mocha](http://mochajs.org/) exports interface so they can also be run with Nightwatch itself.

To run the unit tests using mocha, do:

```sh
$ npm test
```

To run the unit tests using Nightwatch, do:

```sh
$ npm run unit-tests
```

To check test coverage, run the command:

```sh
$ npm run mocha-coverage
```
and then open the generate file _coverage.html_ in your browser.

### Discuss
The [Mailing List/Google Group](https://groups.google.com/forum/#!forum/nightwatchjs) is the most appropriate tool for Nightwatch related discussions. In addition, there is a [StackOverflow Nightwatch.js tag](http://stackoverflow.com/questions/tagged/nightwatch.js) at your disposal and [Twitter](https://twitter.com/nightwatchjs).

### Setup Guides
Browser specific setup and usage guides along with debugging instructions can be found on the [**Wiki**](https://github.com/nightwatchjs/nightwatch/wiki).

