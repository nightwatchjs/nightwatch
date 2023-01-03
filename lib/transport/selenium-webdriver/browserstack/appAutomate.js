const BrowserStack = require('./browserstack.js');
const AppiumMixin = require('../appiumMixin.js');

class AppAutomate extends BrowserStack {
  get ApiUrl() {
    return `https://api.browserstack.com/${this.productNamespace}`;
  }

  get productNamespace() {
    return 'app-automate';
  }

  createSessionOptions() {
    this.extractAppiumOptions();

    return this.desiredCapabilities;
  }

  createDriver({options}) {
    return this.createAppiumDriver({options});
  }
}

Object.assign(AppAutomate.prototype, AppiumMixin);

module.exports = AppAutomate;
