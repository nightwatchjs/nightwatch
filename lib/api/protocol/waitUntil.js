const ProtocolAction = require('./_base-action.js');

/**
 * Waits for a condition to evaluate to a "truthy" value. The condition may be specified by any function which returns a Promise.
 *
 * An optional wait time can be specified, otherwise the global waitForConditionTimeout value will be used.
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     browser
 *       .url('https://nightwatchjs.org)
 *       .waitUntil(async function() {
 *         const title = await this.execute(function() {
 *           return document.title;
 *         });
 *
 *         return title === 'Nightwatch.js';
 *       }, 1000);
 *   }
 * }
 *
 * @link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html#wait
 * @selenium_webdriver
 * @syntax .waitUntil(conditionFn, waitTimeMs, [callback])
 * @param {function} conditionFn The condition to wait on, defined as function which returns a Promise
 * @param {number} [waitTimeMs] How long to wait for the condition to be true.
 * @param {Function} [callback] An optional callback which will be called with the result
 * @api protocol.utilities
 */
const {makePromise} = require('../../utils');

module.exports = class Action extends ProtocolAction {
  get requiresSeleniumWebdriver() {
    return true;
  }

  async command(conditionFn,
    timeMs = this.settings.globals.waitForConditionTimeout,
    callback = function(r) {return r}
  ) {
    const result = await this.transportActions.wait(conditionFn.bind(this.api), timeMs);

    return makePromise(callback, this.api, [result]);
  }
};
