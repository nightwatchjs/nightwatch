const {By, RelativeBy} = require('selenium-webdriver');

const LocateElement = require('./locator.js');
const {AVAILABLE_LOCATORS} = require('./locator');

class AppiumLocator extends LocateElement {
  /**
   * @param {object|string} element
   * @return {By|RelativeBy}
   */
  static create(element) {
    if (!element) {
      throw new Error(`Error while trying to locate element: missing element definition; got: "${element}".`);
    }

    if (element instanceof By) {
      return element;
    }

    if (element.by instanceof By) {
      return element.by;
    }

    if (element.value instanceof RelativeBy) {
      return element.value;
    }

    const elementInstance = LocateElement.createElementInstance(element);

    if (elementInstance.locateStrategy === 'id') {
      return new By(elementInstance.locateStrategy, elementInstance.selector);
    }

    return By[AVAILABLE_LOCATORS[elementInstance.locateStrategy]](elementInstance.selector);
  }
}

module.exports = AppiumLocator;
