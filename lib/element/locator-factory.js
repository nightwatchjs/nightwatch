const {By, RelativeBy} = require('selenium-webdriver');

const Locator = require('./locator.js');
const AppiumLocator = require('./appium-locator.js');

class NightwatchLocator {
  /**
   * @param {object|string} element
   * @param {boolean} isAppiumClient
   * @return {By|RelativeBy}
   */
  static create(element, isAppiumClient) {
    if (isAppiumClient) {
      return AppiumLocator.create(element);
    }

    return Locator.create(element);
  }
}

module.exports = NightwatchLocator;
