/**
 * A simple perform command which allows access to the "api" in a callback.
 * Can be useful if you want to read variables set by other commands.
 *
 * ```
 * this.demoTest = function (browser) {
 *   var elementValue;
 *   browser
 *     .getValue('.some-element', function(result) {
 *       elementValue = result.value;
 *     })
 *     // other stuff going on ...
 *     .perform(function(client, done) {
 *       console.log('elementValue', elementValue);
 *       // potentially other async stuff going on
 *       // on finished, call the done callback
 *       done();
 *     });
 * };
 * ```
 *
 * @method perform
 * @param {function} callback the function to run as part of the queue; it is called with the <code>browser</code> object as the first argument and optionally a <code>done</code> callback in case of an async operation.
 * @api commands
 */

var util = require('util');
var events = require('events');

function Perform() {
  events.EventEmitter.call(this);
}

util.inherits(Perform, events.EventEmitter);

Perform.prototype.command = function(callback) {
  var self = this;
  var doneCallback;
  if (callback.length === 0) {
    callback.call(self, self.client.api);
    doneCallback = function() {
      self.emit('complete');
    };
  } else {
    doneCallback = function() {
      callback.call(self, self.client.api, function() {
        self.emit('complete');
      });
    };
  }

  process.nextTick(doneCallback);

  return this;
};

module.exports = Perform;
