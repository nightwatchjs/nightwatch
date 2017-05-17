var util = require('util');
var events = require('events');

/**
 * Suspends the test indefinitely.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.freeze();
 * };
 * ```
 *
 * @method freeze
 * @api commands
 */

function Freeze() {
  events.EventEmitter.call(this);
}

util.inherits(Freeze, events.EventEmitter);

Freeze.prototype.command = function() {
  return this;
};

module.exports = Freeze;
