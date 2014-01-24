NightWatch
==========

[![Build Status](https://travis-ci.org/beatfactor/nightwatch.png?branch=master)](https://travis-ci.org/beatfactor/nightwatch)

UI automated testing framework based on [Node.js](http://nodejs.org/) and [Selenium WebDriver](http://docs.seleniumhq.org/projects/webdriver/)

***
## Quick Start

## Developer Guide
[http://nightwatchjs.org/guide](http://nightwatchjs.org/guide) 

## API Reference
[http://nightwatchjs.org/api](http://nightwatchjs.org/api) 

### Selenium WebDriver standalone server

First thing you need to download the selenium server jar file `selenium-server-standalone-2.x.x.jar` from here: 
(https://code.google.com/p/selenium/downloads/list)

### Install NightWatch

Install Node.js and then:
```sh
$ git clone git@github.com:beatfactor/nightwatch.git
$ cd nightwatch
$ npm install
```

### Run tests

The tests for nightwatch are written using [nodeunit](https://github.com/caolan/nodeunit) as the test framework. 

To run the nodeunit tests do:
```sh
$ npm test
```  
