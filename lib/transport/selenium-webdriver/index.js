class SeleniumWebdriver {

  static create({nightwatchInstance, browserName}) {
    if (nightwatchInstance.settings.webdriver.use_legacy_jsonwire) {
      console.warn('Legacy browser drivers are not supported anymore.');
    }

    let Driver;
    switch (browserName) {
      case 'firefox':
        Driver = require('./firefox.js');
        break;
    }

    return new Driver(nightwatchInstance);

  }
}

module.exports = SeleniumWebdriver;
