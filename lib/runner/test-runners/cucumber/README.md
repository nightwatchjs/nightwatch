# Using Cucumber.js with Nightwatch 2

Nightwatch 2 brings integrated support for using [Cucumber.js](https://cucumber.io/) directly as an alternative test runner. No other plugins are necessary, other than the [Cucumber library](https://www.npmjs.com/package/@cucumber/cucumber) itself (version 7.3 or higher). 

Simply run the following in the same project where Nightwatch is also installed:

```sh
$ npm i @cucumber/cucumber --save-dev
```

The [examples folder](https://github.com/nightwatchjs/nightwatch/tree/v2/examples/cucumber-js) contains a few example spec files and cucumber features, as well as configuration details. 
