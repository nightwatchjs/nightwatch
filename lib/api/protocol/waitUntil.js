const ProtocolAction = require('./_base-action.js');

/**
 * Waits for a condition to evaluate to a "truthy" value. The condition may be specified by any function which
 * returns the value to be evaluated or a Promise to wait for.
 *
 * An optional wait time can be specified, otherwise the global waitForConditionTimeout value will be used.
 *
 * @example
 * describe('waitUntil Example', function() {
 *   it('demo Test', function(browser) {
 *     browser
 *       .url('https://nightwatchjs.org)
 *       .waitUntil(async function() {
 *         const title = await this.execute(function() {
 *           return document.title;
 *         });
 *
 *         return title === 'Nightwatch.js';
 *       }, 1000);
 *   });
 * }
 *
 * @method waitUntil
 * @link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html#wait
 * @selenium_webdriver
 * @syntax .waitUntil(conditionFn, [callback])
 * @syntax .waitUntil(conditionFn, [waitTimeMs], [callback])
 * @syntax .waitUntil(conditionFn, [waitTimeMs], [retryInterval], [callback])
 * @syntax .waitUntil(conditionFn, [waitTimeMs], [retryInterval], [message], [callback])
 * @param {function} conditionFn The condition to wait on, defined as function which returns a Promise
 * @param {number} [waitTimeMs] How long to wait for the condition to be true (in milliseconds).
 * @param {number} [retryInterval] The interval to use between checks (in milliseconds).
 * @param {Function} [callback] An optional callback which will be called with the result
 * @api protocol.utilities
 * @since 2.0.0
 */
const {makePromise, isFunction, isUndefined, isNumber, isString} = require('../../utils');

module.exports = class WaitUntil extends ProtocolAction {
  get requiresSeleniumWebdriver() {
    return true;
  }

  static isParamTypeValid(param, expectedType) {
    if (typeof param !== expectedType) {
      // eslint-disable-next-line no-console
      console.warn(`Expected "${expectedType}" argument type for ${param}; "${typeof param}" given – using default value`);

      return false;
    }

    return true;
  }

  static hasMessage(msg) {
    return isString(msg) && msg || (msg instanceof Error);
  }

  static get isTraceable() {
    return true;
  }

  //timeMs, retryInterval, message, callback = function(r) {return r}
  async command(conditionFn, ...args) {
    let callback = function(r) {return r};
    let message;
    let timeMs = this.settings.globals.waitForConditionTimeout;
    let retryInterval = this.settings.globals.waitForConditionPollInterval;

    if (args.length >= 3 && WaitUntil.hasMessage(args[2])) {
      timeMs = WaitUntil.isParamTypeValid(args[0], 'number') ? args[0] : timeMs;
      retryInterval = WaitUntil.isParamTypeValid(args[1], 'number') ? args[1] : retryInterval;
      message = args[2];
      callback = isFunction(args[3]) ? args[3] : callback;
    } else {
      switch (args.length) {
        case 2:
        case 3:
          timeMs = WaitUntil.isParamTypeValid(args[0], 'number') ? args[0] : timeMs;

          if (isFunction(args[1]) && isUndefined(args[2])) {
            callback = args[1];
          } else {
            retryInterval = WaitUntil.isParamTypeValid(args[1], 'number') ? args[1] : retryInterval;
            callback = !isUndefined(args[2]) && WaitUntil.isParamTypeValid(args[2], 'function') ? args[2] : callback;
          }

          break;

        case 1:
          if (isFunction(args[0])) {
            callback = args[0];
          } else if (isNumber(args[0])) {
            timeMs = args[0];
          }
          break;
      }
    }

    const result = await this.transportActions.wait(() => {
      return conditionFn.bind(this.api);
    }, timeMs, isString(message) ? message : '', retryInterval);

    if (result && result.error instanceof Error) {
      await callback(result);

      if (message instanceof Error) {
        throw message;
      }

      throw result.error;
    }

    return makePromise(callback, this.api, [result]);
  }
};
