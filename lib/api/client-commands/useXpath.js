const LocateStrategy = require('./_locateStrategy.js');
const Strategies = require('../../element').LocateStrategy;

/**
 * Sets the locate strategy for selectors to xpath, therefore every following selector needs to be specified as xpath.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser
 *     .useXpath() // every selector now must be xpath
 *     .click("//tr[@data-recordid]/span[text()='Search Text']");
 * };
 *
 * @method useXpath
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.utilities
 */

class Command extends LocateStrategy {
  constructor() {
    super();
    this.strategy = Strategies.XPATH;
  }
}

module.exports = Command;
