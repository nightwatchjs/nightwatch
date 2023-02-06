const { By, RelativeBy } = require('selenium-webdriver');

const Utils = require('../utils/index.js');
const Element = require('./index.js');
const Locator = require('./locator.js');

class ScopedElementLocator {
  constructor(selector, nightwatchInstance) {
    if (selector instanceof ScopedElementLocator) {
      return selector;
    }

    const { waitForConditionTimeout, waitForConditionPollInterval } =
      nightwatchInstance.settings.globals;

    let index = 0;
    let timeout = waitForConditionTimeout;
    let condition = selector;
    let retryInterval = waitForConditionPollInterval;
    let locateStrategy = nightwatchInstance.locateStrategy;
    let abortOnFailure = true;
    let suppressNotFoundErrors = false;

    if (
      selector instanceof Element ||
      (Utils.isObject(selector) && 'selector' in selector)
    ) {
      if (Number.isInteger(selector.index)) {
        index = selector.index;
      }

      if (Number.isInteger(selector.timeout)) {
        timeout = selector.timeout;
      }

      if (Number.isInteger(selector.retryInterval)) {
        retryInterval = selector.retryInterval;
      }

      if (Utils.isBoolean(selector.abortOnFailure)) {
        abortOnFailure = selector.abortOnFailure;
      }

      if (selector.locateStrategy) {
        locateStrategy = selector.locateStrategy;
      }

      if (Utils.isBoolean(selector.suppressNotFoundErrors)) {
        suppressNotFoundErrors = selector.suppressNotFoundErrors;
      }

      condition =
        selector.selector instanceof By ||
        selector.selector instanceof RelativeBy
          ? selector.selector
          : By[Locator.AVAILABLE_LOCATORS[locateStrategy]](selector.selector);
    } else if (Utils.isString(selector)) {
      condition = By[Locator.AVAILABLE_LOCATORS[locateStrategy]](selector);
    }

    this.index = index;
    this.timeout = timeout;
    this.condition = condition;
    this.retryInterval = retryInterval;
    this.locateStrategy = locateStrategy;
    this.abortOnFailure = abortOnFailure;
    this.suppressNotFoundErrors = suppressNotFoundErrors;
  }
}

exports.ScopedElementLocator = ScopedElementLocator;
