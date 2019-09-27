const LocateStrategy = require('./_locateStrategy.js');
const Strategies = require('../../element/strategy.js');

/**
 * Sets the locate strategy for selectors to accessibility id, therefore every following selector needs to be specified as accessibility id.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser
 *     .useAccessibilityId() // every selector now must be acc
 *     .click("submitButton");
 * };
 *
 * @method useAccessibilityId
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.utilities
 */

class Command extends LocateStrategy {
  constructor() {
    super();
    this.strategy = Strategies.ACCESSIBILITY_ID;
  }
}

module.exports = Command;
