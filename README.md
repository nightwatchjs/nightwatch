# Nightwatch.js

[![npm](https://img.shields.io/npm/v/nightwatch.svg)](https://www.npmjs.com/package/nightwatch)
[![Node.js CI](https://github.com/nightwatchjs/nightwatch/actions/workflows/build-node.yaml/badge.svg?branch=main)](https://github.com/nightwatchjs/nightwatch/actions/workflows/build-node.yaml)
[![codecov](https://codecov.io/gh/nightwatchjs/nightwatch/branch/main/graph/badge.svg?token=MSObyfECEh)](https://codecov.io/gh/nightwatchjs/nightwatch)
[![Discord][discord-badge]][discord]
[![Node Support](https://img.shields.io/badge/node-%3E12.x-brightgreen.svg)](https://github.com/nightwatchjs/nightwatch/blob/27a855a2ec0c2008073708d5a2286c2819584fdc/.github/workflows/build-node.yaml#L19)


<p align="center">
  <img alt="Nightwatch.js Logo" src="https://raw.githubusercontent.com/nightwatchjs/nightwatch/main/.github/assets/nightwatch-logo.png" width=300 />
</p>

#### [Homepage](https://nightwatchjs.org) &bullet; [Developer Guide](https://nightwatchjs.org/guide) &bullet; [API Reference](https://nightwatchjs.org/api) &bullet; [About](https://nightwatchjs.org/about) &bullet; [Blog](https://nightwatchjs.org/blog)

Nightwatch is an integrated testing framework powered by Node.js and using the [W3C Webdriver API](https://www.w3.org/TR/webdriver/). It is a complete testing solution developed at [BrowserStack](https://www.browserstack.com/) and which can be used for: 

☑️ end-to-end testing of web applications and websites<br>
☑️ component testing in isolation (React / Vue)<br>
☑️ Node.js unit and API testing

## 🚀 Nightwatch v2

#### [What's New](https://nightwatchjs.org/guide/getting-started/whats-new-v2.html) | [Release Notes](https://github.com/nightwatchjs/nightwatch/releases/tag/v2.0.0) | [Discussions](https://github.com/nightwatchjs/nightwatch/discussions)

[Nightwatch v2](https://github.com/nightwatchjs/nightwatch/releases/tag/v2.0.0) is now available in the public NPM channel. Read the [what's new](https://nightwatchjs.org/guide/getting-started/whats-new-v2.html) docs page for an overview of the new features, improvements, and important changes.

## ⚙️ Get started in 60 seconds

#### 1. Install Nightwatch from NPM

From your existing project's root dir:

```sh
npm init nightwatch@latest
```

or, if you want to initialize a new project:


```sh
npm init nightwatch@latest ./path/to/new/project
```


![nightwatch-cli-gif](https://user-images.githubusercontent.com/39924567/174841680-59664ff6-da2d-44a3-a1df-52d22c69b1e2.gif)

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

## 🦉 About Nightwatch
Nightwatch was initially built by [@pineviewlabs](https://github.com/pineviewlabs/) - an independent software consultancy based in Oslo, Norway, with help from [contributors](https://github.com/nightwatchjs/nightwatch/graphs/contributors). In mid 2021, Nightwatch has become a part of the [@BrowserStack](https://github.com/browserstack) family and it is being developed further at the BrowserStack Open-source Program Office. Read more on [our blog](https://nightwatchjs.org/blog/nightwatch-has-joined-the-browserstack-family.html).

## Licence
[MIT](https://github.com/nightwatchjs/nightwatch/blob/main/LICENSE.md)

[discord-badge]: https://img.shields.io/discord/618399631038218240.svg?color=7389D8&labelColor=6A7EC2&logo=discord&logoColor=ffffff&style=flat-square&label=discord
[discord]: https://discord.gg/SN8Da2X
