# Nightwatch

UI automated testing framework powered by [Node.js](http://nodejs.org/). It uses the [Selenium WebDriver API](https://code.google.com/p/selenium/wiki/JsonWireProtocol).

[![Build Status](https://travis-ci.org/nightwatchjs/nightwatch.svg?branch=master)](https://travis-ci.org/nightwatchjs/nightwatch) [![NPM version](https://badge.fury.io/js/nightwatch.png)](http://badge.fury.io/js/nightwatch) [![Coverage Status](https://coveralls.io/repos/nightwatchjs/nightwatch/badge.svg?branch=master&service=github)](https://coveralls.io/github/nightwatchjs/nightwatch?branch=master)

***

#### [Homepage](http://nightwatchjs.org) | [Developer Guide](http://nightwatchjs.org/guide) | [API Reference](http://nightwatchjs.org/api)

### Selenium WebDriver standalone server
Nightwatch works with the Selenium standalone server so the first thing you need to do is download the selenium server jar file `selenium-server-standalone-2.x.x.jar` from the Selenium releases page:
**https://selenium-release.storage.googleapis.com/index.html**

### Install Nightwatch

Install Node.js and then:
```sh
$ git clone git@github.com:nightwatchjs/nightwatch.git
$ cd nightwatch
$ npm install
```

### Run tests
The tests for nightwatch are written using [nodeunit](https://github.com/caolan/nodeunit) as the test framework. To run the nodeunit tests do:
```sh
$ npm test
```

### Discuss
The [Mailing List/Google Group](https://groups.google.com/forum/#!forum/nightwatchjs) is the most appropriate tool for Nightwatch related discussions. In addition, there is a [StackOverflow Nightwatch.js tag](http://stackoverflow.com/questions/tagged/nightwatch.js) at your disposal and [Twitter](https://twitter.com/nightwatchjs).

### Setup Guides
Browser specific setup and usage guides along with debugging instructions can be found on the [**Wiki**](https://github.com/nightwatchjs/nightwatch/wiki).

### Bug Reports / Feature Requests
<br>Quick search on existing issues to reduce duplication.
<br>Comprehensive issue title
<br>Nightwatch version, OS platform, Selenium version, nodejs version
<br>Indicate whether you can reproduce the issue at will, ocasionally, or not at all.
<br>Describe your method of interacting with Nightwatch in addition to the intent of each step.
<br>ex: node node_modules/nightwatch/bin runner.js -t tests/abc.js --env chrome 
<br>After your steps, precisely describe the observed (actual) result and the expected result. Clearly separate facts (observations) from speculations.
<br>ex:
<br>Expected results: Nightwatch execution should contain xyz.
<br>Actual results: Nightwatch execution does not contain xyz.

<br> Code sample where the issue is observed
<br> Issue involving any crash / exception: Stacktrace or execution log. 




