const {By} = require('selenium-webdriver');
const Element = require('../../element');

const Locators = {
  'css selector': 'css',
  'id': 'id',
  'link text': 'linkText',
  'name': 'name',
  'partial link text': 'partialLinkText',
  'tag name': 'tagName',
  'xpath': 'xpath',
  'className': 'className'
};

class SeleniumWebdriver {

  /**
   * @param {object|string} element
   * @return {*}
   */
  static createLocator(element) {
    if (!element) {
      throw new Error(`Missing element definition; got: "${element}".`);
    }

    if (element instanceof By) {
      return element;
    }

    if (typeof element != 'object' && typeof element != 'string') {
      throw new Error(`Invalid element definition type; expected string or object, but got: ${typeof element}.`);
    }

    let selector;
    let strategy;

    if (typeof element == 'object' && element.value && element.using) {
      selector = element.value;
      strategy = element.using;
    } else {
      selector = element;
    }

    const elementInstance = Element.createFromSelector(selector, strategy);

    return By[Locators[elementInstance.locateStrategy]](elementInstance.selector);
  }

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
