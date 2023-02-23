const {By, RelativeBy} = require('selenium-webdriver');

const LocateElement = require('./locator.js');
const {AVAILABLE_LOCATORS} = LocateElement;

class AppiumLocator extends LocateElement {
  /**
   * @param {object|string} element
   * @return {By|RelativeBy}
   */
  static create(element) {
    if (!element) {
      throw new Error(`Error while trying to locate element: missing element definition; got: "${element}".`);
    }

    const byInstance = LocateElement.locateInstanceOfBy(element);
    if (byInstance !== null) {
      return byInstance;
    }

    const elementInstance = LocateElement.createElementInstance(element);

    if (elementInstance.locateStrategy === 'id') {
      return new By(elementInstance.locateStrategy, elementInstance.selector);
    }

    return By[AVAILABLE_LOCATORS[elementInstance.locateStrategy]](elementInstance.selector);
  }
}

module.exports = AppiumLocator;
