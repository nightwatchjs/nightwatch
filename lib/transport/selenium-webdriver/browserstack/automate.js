const BrowserStack = require('./browserstack.js');
const {Capabilities} = require('selenium-webdriver');

class Automate extends BrowserStack {
  get ApiUrl() {
    return `https://api.browserstack.com/${this.productNamespace}`;
  }

  get productNamespace() {
    return 'automate';
  }

  createDriver({options = this.desiredCapabilities}) {
    if (options instanceof Capabilities) {
      return super.createDriver({options});
    }

    return this.createAppiumDriver({options});
  }
}

module.exports = Automate;
