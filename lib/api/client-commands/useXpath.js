const LocateStrategy = require('./_locateStrategy.js');
const Strategies = require('../../util/locatestrategy.js');

/**
 * Sets the locate strategy for selectors to xpath, therefore every following selector needs to be specified as xpath.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser
 *     .useXpath() // every selector now must be xpath
 *     .click("//tr[@data-recordid]/span[text()='Search Text']");
 * };
 * ```
 *
 * @method useXpath
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api commands
 */

class Command extends LocateStrategy {
  constructor() {
    super();
    this.strategy = Strategies.XPATH;
  }
}

module.exports = Command;
