const BrowserStack = require('./browserstack.js');
const AppiumMixin = require('./appiumMixin');
const {Capabilities} = require('selenium-webdriver');

class Automate extends BrowserStack {
  get ApiUrl() {
    return `https://api.browserstack.com/${this.productNamespace}`;
  }

  get productNamespace() {
    return 'automate';
  }

  createSessionOptions(argv) {
    this.extractAppiumOptions();

    return super.createSessionOptions(argv) || this.desiredCapabilities;
  }

  createDriver({options}) {
    if (options instanceof Capabilities) {
      return super.createDriver({options});
    }

    return this.createAppiumDriver({options});
  }
}

Object.assign(Automate.prototype, AppiumMixin);

module.exports = Automate;
