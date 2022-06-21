# Nightwatch.js

[![npm](https://img.shields.io/npm/v/nightwatch.svg)](https://www.npmjs.com/package/nightwatch)
[![Node.js CI](https://github.com/nightwatchjs/nightwatch/actions/workflows/build-node.yaml/badge.svg?branch=main)](https://github.com/nightwatchjs/nightwatch/actions/workflows/build-node.yaml)
[![codecov](https://codecov.io/gh/nightwatchjs/nightwatch/branch/main/graph/badge.svg?token=MSObyfECEh)](https://codecov.io/gh/nightwatchjs/nightwatch)
[![npm package](https://img.shields.io/npm/dm/nightwatch.svg)](https://www.npmjs.com/package/nightwatch)
[![Discord][discord-badge]][discord]
[![Node Support](https://img.shields.io/badge/node-%3E12.x-brightgreen.svg)](https://github.com/nightwatchjs/nightwatch/blob/27a855a2ec0c2008073708d5a2286c2819584fdc/.github/workflows/build-node.yaml#L19)


<p align="center">
  <img alt="Nightwatch.js Schematic Logo" src=".github/assets/nightwatch-logo.svg" width=300 />
</p>

#### [Homepage](https://nightwatchjs.org) &bullet; [Developer Guide](https://nightwatchjs.org/guide) &bullet; [API Reference](https://nightwatchjs.org/api) &bullet; [About](https://nightwatchjs.org/about) &bullet; [Blog](https://nightwatchjs.org/blog)

***
Automated end-to-end testing framework powered by [Node.js](http://nodejs.org/) and using [W3C Webdriver](https://www.w3.org/TR/webdriver/) (formerly [Selenium](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol)).

Nightwatch is a complete and integrated solution for end-to-end testing of web applications and websites. It can also be used for Node.js unit and integration testing. 

## Nightwatch v2.0

####  [What's New](https://nightwatchjs.org/guide/getting-started/whats-new-v2.html) | [Release Notes](https://github.com/nightwatchjs/nightwatch/releases/tag/v2.0.0) | [Discussions](https://github.com/nightwatchjs/nightwatch/discussions)

We're delighted to announce that [Nightwatch v2.0](https://github.com/nightwatchjs/nightwatch/releases/tag/v2.0.0) is now available in the public NPM channel. Read the [what's new](https://nightwatchjs.org/guide/getting-started/whats-new-v2.html) docs page for an overview of the new features, improvements, and important changes.

Install with: 
```sh
npm i nightwatch
```

## Get started in 60 seconds
![nightwatch-cli-gif](https://user-images.githubusercontent.com/39924567/174761950-fbf54e86-b160-4597-b169-976344ff6ef0.gif)

#### 1. Install Nightwatch from NPM

```sh
# from your existing project's root dir
$ npm init nightwatch

# if you want to initialize a new project
$ npm init nightwatch path/to/new/project
```

#### 2. Answer a few questions about your preferred setup:

- What is your Language - Test Runner setup? 
- Where do you want to run your e2e tests? 
- Where you'll be testing on? 
- Where do you plan to keep your end-to-end tests? 
- What is the base_url of your project? 

Nightwatch will do the entire setup for you based on your answers.

#### 3. Run a Demo Test:

Nightwatch comes with a few examples, which are automatically copied to your Nightwatch project during the setup and can also be used as boilerplate to write your own tests on top of them.

You can follow the instructions given at the end of the setup to run your first test with Nightwatch.

<img width="413" alt="image" src="https://user-images.githubusercontent.com/39924567/174763723-aff4d501-6320-402c-81cc-de75fbb5e8f0.png">

---

## Manually Download Browser Drivers

Nightwatch uses a [WebDriver](https://www.w3.org/TR/webdriver/) compatible server to control the browser. WebDriver is a W3C specification and industry standard which provides a platform and HTTP protocol to interact with a browser.
   
Nightwatch includes support for automatically managing the following services:
#### ChromeDriver 
- for running tests against the Chrome browser;
- download url: [https://sites.google.com/chromium.org/driver/](https://sites.google.com/chromium.org/driver/).

#### GeckoDriver
- for running tests against the Mozilla Firefox browser;
- download url: [https://github.com/mozilla/geckodriver/releases](https://github.com/mozilla/geckodriver/releases).
 
#### Selenium Standalone Server 
- allows managing multiple browser configurations in one place and also to make use of the [Selenium Grid](https://github.com/SeleniumHQ/selenium/wiki/Grid2) service;
- the selenium server jar file `selenium-server-standalone-4.x.x.jar` can be downloaded from the Selenium releases page: https://selenium-release.storage.googleapis.com/index.html

> It's important to note that, while the Selenium Server was required with older Nightwatch versions (`v0.9` and prior), starting with version `1.0` the Selenium Server is no longer necessary.

Specific WebDriver setup guides can be found on the [Docs website](https://nightwatchjs.org/gettingstarted/browser-drivers-setup/). Legacy Selenium drivers setup guides along with debugging instructions can be found on the [**Wiki**](https://github.com/nightwatchjs/nightwatch/wiki).

## Examples
Examples below are written using Nightwatch 2.0.

#### Search for the term "Nightwatch.js" using:
- Google: [examples/tests/google.js](https://github.com/nightwatchjs/nightwatch/blob/main/examples/tests/google.js)
- DuckDuckGo: [examples/tests/duckDuckGo.js](https://github.com/nightwatchjs/nightwatch/blob/main/examples/tests/duckDuckGo.js)
- Ecosia.org: [examples/tests/ecosia.js](https://github.com/nightwatchjs/nightwatch/blob/main/examples/tests/ecosia.js)

#### Google search using page objects
- [examples/tests/googlePageObject.js](https://github.com/nightwatchjs/nightwatch/blob/main/examples/tests/googlePageObject.js)

#### ToDo App on AngularJs homepage
- [examples/tests/angularTest.js](https://github.com/nightwatchjs/nightwatch/blob/main/examples/tests/angularTest.js)
- this contains demo on how to use the new `element()` global api

You can run any of the examples by simply referring to the examples folder like below:
```sh
npx nightwatch examples/tests/angularTest.js
```

#### CucumberJS examples
 - [examples/cucumber-js/](https://github.com/nightwatchjs/nightwatch/tree/main/examples/cucumber-js)

The bundled config file which is auto-generated by Nightwatch on the first run (only if one is not already present in the project), contains configuration and examples for running the CucumberJS examples immediately, using the following:

```sh
npx nightwatch --env cucumber-js
```

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

## About Nightwatch
Nightwatch was initially built by [@pineviewlabs](https://github.com/pineviewlabs/) - an independent software consultancy based in Oslo, Norway, with help from [contributors](https://github.com/nightwatchjs/nightwatch/graphs/contributors). In mid 2021, Nightwatch has become a part of the [@BrowserStack](https://github.com/browserstack) family and it is being developed further at the BrowserStack Open-source Program Office. Read more on [our blog](https://nightwatchjs.org/blog/nightwatch-has-joined-the-browserstack-family.html).

We are thankful for everyone who supported Nightwatch on the [OpenCollective](https://opencollective.com/) platform.

## Licence
[MIT](https://github.com/nightwatchjs/nightwatch/blob/main/LICENSE.md)

[discord-badge]: https://img.shields.io/discord/618399631038218240.svg?color=7389D8&labelColor=6A7EC2&logo=discord&logoColor=ffffff&style=flat-square
[discord]: https://discord.gg/SN8Da2X