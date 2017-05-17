var util = require('util');
var events = require('events');

/**
 * Suspends the test for the given time in milliseconds.
 * If pausing indefinitely is needed, see `freeze`.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.pause(1000);
 * };
 * ```
 *
 * @method pause
 * @param {number} ms The number of milliseconds to wait.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api commands
 */

function Pause() {
  events.EventEmitter.call(this);
}

util.inherits(Pause, events.EventEmitter);

Pause.prototype.command = function(ms, cb) {
  var self = this;
  if (!ms) {
    throw new Error('method expects milliseconds argument.');
  }
  setTimeout(function() {
    // if we have a callback, call it right before the complete event
    if (cb) {
      cb.call(self.client.api);
    }

    self.emit('complete');
  }, ms);

  return this;
};

module.exports = Pause;
