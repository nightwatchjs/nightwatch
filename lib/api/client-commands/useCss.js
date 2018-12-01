const LocateStrategy = require('./_locateStrategy.js');
const Strategies = require('../../util/locatestrategy.js');

/**
 * Sets the locate strategy for selectors to `css selector`, therefore every following selector needs to be specified as css.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser
 *     .useCss() // we're back to CSS now
 *     .setValue('input[type=text]', 'nightwatch');
 * };
 *
 * @method useCss
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.utilities
 */

class Command extends LocateStrategy {
  constructor() {
    super();
    this.strategy = Strategies.CSS_SELECTOR;
  }
}

module.exports = Command;
