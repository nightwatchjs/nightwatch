var util = require('util');
var locateStrategy = require('./_locateStrategy.js');

/**
 * Sets the locate strategy for selectors to `css selector`, therefore every following selector needs to be specified as css.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser
 *     .useCss() // we're back to CSS now
 *     .setValue('input[type=text]', 'nightwatch');
 * };
 * ```
 *
 * @method useCss
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api commands
 */

function Command() {
  this.strategy = 'css selector';
  locateStrategy.call(this);
}

util.inherits(Command, locateStrategy);

module.exports = Command;
