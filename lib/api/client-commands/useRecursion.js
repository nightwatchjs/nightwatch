var util = require('util');
var locateStrategy = require('./_locateStrategy.js');

/**
 * Sets the locate strategy for selectors to `recursion`, therefore every following selector needs to be an array of element objects
 * This is used internally for sections of page objects which require element nesting
 *
 * @method useRecursion
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api commands
 */

function Command() {
  this.strategy = 'recursion';
  locateStrategy.call(this);
}

util.inherits(Command, locateStrategy);

module.exports = Command;
