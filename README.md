# Nightwatch

UI automated testing framework powered by [Node.js](http://nodejs.org/). It uses the [Selenium WebDriver API](https://code.google.com/p/selenium/wiki/JsonWireProtocol).

[![Build Status](https://travis-ci.org/beatfactor/nightwatch.png?branch=master)](https://travis-ci.org/beatfactor/nightwatch) [![NPM version](https://badge.fury.io/js/nightwatch.png)](http://badge.fury.io/js/nightwatch) [![Dependency Status](https://david-dm.org/beatfactor/nightwatch.png)](https://david-dm.org/beatfactor/nightwatch)

***

#### [Homepage](http://nightwatchjs.org) | [Developer Guide](http://nightwatchjs.org/guide) | [API Reference](http://nightwatchjs.org/api) 

### Selenium WebDriver standalone server
Nightwatch works with the Selenium standalone server sp first thing you need to do is download the selenium server jar file `selenium-server-standalone-2.x.x.jar` from the Selenium releases page:  
**http://selenium-release.storage.googleapis.com/index.html**

### Install Nightwatch

Install Node.js and then:
```sh
$ git clone git@github.com:beatfactor/nightwatch.git
$ cd nightwatch
$ npm install
```

### Run tests
The tests for nightwatch are written using [nodeunit](https://github.com/caolan/nodeunit) as the test framework. To run the nodeunit tests do:
```sh
$ npm test
```  

### Discuss
In addition to [Twitter](https://twitter.com/nightwatchjs), the [Mailing List/Google Group](https://groups.google.com/forum/#!forum/nightwatchjs) is also available for Nightwatch related discussions.
