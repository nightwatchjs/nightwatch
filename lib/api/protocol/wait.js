const ProtocolAction = require('./_base-action.js');

/**
 * Waits for a condition to evaluate to a "truthy" value. The condition may be specified by a Condition, as a custom function, or as any promise-like thenable.
 *
 * @example
 * module.exports = {
 *  'demo Test' : function(browser) {
 *     browser
 *       .url('https://nightwatchjs.org)
 *       .wait(async function() {
 *         const title = await this.execute(function() {
 *           return document.title;
 *         });
 *
 *         return title === 'Nightwatch.js';
 *       }, 1000);
 *   }
 * }
 *
 * @link /#wait
 * @selenium_webdriver
 * @syntax .wait(conditionFn, waitTimeMs, [callback])
 * @param {function} conditionFn The condition to wait on, defined as a Promise, Condition object, or a function to evaluate as a condition.
 * @param {number} [waitTimeMs] How long to wait for the condition to be true.
 * @param {Function} [callback]
 * @api protocol.navigation
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
