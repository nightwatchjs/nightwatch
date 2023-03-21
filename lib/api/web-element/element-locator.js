const {By, RelativeBy} = require('selenium-webdriver');

const Utils = require('../../utils');
const Element = require('./index.js');
const Locator = require('../../element/locator.js');

class ElementLocator {
  constructor(selector, options = {}) {
    this.index = ElementLocator.getIndex(selector);
    this.timeout = ElementLocator.getOrDefault(selector, 'timeout', options.waitForConditionTimeout);
    this.retryInterval = ElementLocator.getOrDefault(selector, 'retryInterval', options.waitForConditionPollInterval);
    this.locateStrategy = ElementLocator.getOrDefault(selector, 'locateStrategy', options.locateStrategy);
    this.abortOnFailure = ElementLocator.getOrDefault(selector, 'abortOnFailure', true);
    this.suppressNotFoundErrors = ElementLocator.getOrDefault(selector, 'suppressNotFoundErrors', false);
    this.condition = ElementLocator.getCondition(selector, this.locateStrategy);
  }

  static create(selector, nightwatchInstance = {}) {
    return new ElementLocator(selector, {
      waitForConditionTimeout: nightwatchInstance.settings.globals.waitForConditionTimeout,
      waitForConditionPollInterval: nightwatchInstance.settings.globals.waitForConditionPollInterval,
      locateStrategy: nightwatchInstance.locateStrategy
    });
  }

  static getIndex(selector) {
    return Utils.isNumber(selector.index) ? selector.index : 0;
  }

  static getOrDefault(obj, prop, defaultValue) {
    return Utils.isObject(obj) && obj.hasOwnProperty(prop) ? obj[prop] : defaultValue;
  }

  static getLocateStrategy(element, strategy) {
    if (Utils.isString(element)) {
      return strategy;
    }

    return ElementLocator.getOrDefault(element, 'locateStrategy', strategy);
  }

  static isElementDescriptor(selector) {
    return selector instanceof Element || (Utils.isObject(selector) && 'selector' in selector);
  }

  static getCondition(element, strategy) {
    const locateStrategy = ElementLocator.getLocateStrategy(element, strategy);

    if (ElementLocator.isElementDescriptor(element)) {
      const selector = element.selector instanceof By || element.selector instanceof RelativeBy
        ? element.selector
        : By[Locator.AVAILABLE_LOCATORS[locateStrategy]](element.selector);

      return selector;
    }

    return By[Locator.AVAILABLE_LOCATORS[locateStrategy]](element);
  }

  // constructor(selector, nightwatchInstance) {
  //   if (selector instanceof ElementLocator) {
  //     return selector;
  //   }
  //
  //   const {waitForConditionTimeout, waitForConditionPollInterval} = nightwatchInstance.settings.globals;
  //
  //   let index = 0;
  //   let timeout = waitForConditionTimeout;
  //   let condition = selector;
  //   let retryInterval = waitForConditionPollInterval;
  //   let locateStrategy = nightwatchInstance.locateStrategy;
  //   let abortOnFailure = true;
  //   let suppressNotFoundErrors = false;
  //
  //   if (selector instanceof Element || (Utils.isObject(selector) && 'selector' in selector)) {
  //     if (Number.isInteger(selector.index)) {
  //       index = selector.index;
  //     }
  //
  //     if (Number.isInteger(selector.timeout)) {
  //       timeout = selector.timeout;
  //     }
  //
  //     if (Number.isInteger(selector.retryInterval)) {
  //       retryInterval = selector.retryInterval;
  //     }
  //
  //     if (Utils.isBoolean(selector.abortOnFailure)) {
  //       abortOnFailure = selector.abortOnFailure;
  //     }
  //
  //     if (selector.locateStrategy) {
  //       locateStrategy = selector.locateStrategy;
  //     }
  //
  //     if (Utils.isBoolean(selector.suppressNotFoundErrors)) {
  //       suppressNotFoundErrors = selector.suppressNotFoundErrors;
  //     }
  //
  //     condition =
  //       selector.selector instanceof By ||
  //       selector.selector instanceof RelativeBy
  //         ? selector.selector
  //         : By[Locator.AVAILABLE_LOCATORS[locateStrategy]](selector.selector);
  //   } else if (Utils.isString(selector)) {
  //     condition = By[Locator.AVAILABLE_LOCATORS[locateStrategy]](selector);
  //   }
  //
  //   this.index = index;
  //   this.timeout = timeout;
  //   this.condition = condition;
  //   this.retryInterval = retryInterval;
  //   this.locateStrategy = locateStrategy;
  //   this.abortOnFailure = abortOnFailure;
  //   this.suppressNotFoundErrors = suppressNotFoundErrors;
  // }
}

module.exports.ScopedElementLocator = ElementLocator;
