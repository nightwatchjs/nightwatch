var util = require('util');
var events = require('events');

/**
 * Ends the session. Uses session protocol command.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.end();
 * };
 * ```
 *
 * @method end
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see session
 * @api commands
 */
function End() {
  events.EventEmitter.call(this);
}

util.inherits(End, events.EventEmitter);

End.prototype.command = function(callback) {
  var self = this;
  var client = this.client;

  if (client.sessionId) {
    this.client.api.session('delete', function(result) {
      client.sessionId = client.api.sessionId = null;
      self.complete(callback, result);
    });
  } else {
    setImmediate(function() {
      self.complete(callback, null);
    });
  }

  return this;
};

End.prototype.complete = function(callback, result) {
  this.emit('complete');
  if (typeof callback === 'function') {
    callback.call(this, result);
  }
};

module.exports = End;
