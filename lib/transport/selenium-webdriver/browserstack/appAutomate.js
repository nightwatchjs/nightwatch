const BrowserStack = require('./browserstack.js');

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

module.exports = AppAutomate;
