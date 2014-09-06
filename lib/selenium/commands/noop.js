/**
 * A simple 'no op' command which allows access to the "api" in a callback
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser
 *     .noop(function(api){
 *       console.log('Hello from a noop command.');
 *     });
 * };
 * ```
 *
 * @method noop
 * @param {function} [callback] function to call when the command finishes.
 * @api commands
 */

var util = require('util');
var events = require('events');

function Noop() {
  events.EventEmitter.call(this);
}

util.inherits(Noop, events.EventEmitter);

Noop.prototype.command = function(callback) {
  var self = this;

  callback.call(self, self.client.api);

  process.nextTick(function() {
    self.emit('complete');
  });

  return this;
};

module.exports = Noop;
