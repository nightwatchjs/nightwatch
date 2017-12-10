const LocateStrategy = require('./_locateStrategy.js');
const Element = require('../../page-object/element.js');

/**
 * Sets the locate strategy for selectors to `recursion`, therefore every following selector needs to be an array of element objects
 * This is used internally for sections of page objects which require element nesting
 *
 * @method useRecursion
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api commands
 */

class Command extends LocateStrategy {
  constructor() {
    super();
    this.strategy = Element.STRATEGY_RECURSION;
  }
}

module.exports = Command;
