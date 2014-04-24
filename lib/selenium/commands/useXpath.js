var util = require('util');
var locateStrategy = require('./_locateStrategy.js');

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

function Command() {
  this.strategy = 'xpath';
  locateStrategy.call(this);
}

util.inherits(Command, locateStrategy);

module.exports = Command;
