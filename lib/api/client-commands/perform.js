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
 *     //
 *     // self-completing callback
 *     .perform(function() {
 *       console.log('elementValue', elementValue);
 *       // without any defined parameters, perform
 *       // completes immediately (synchronously)
 *     })
 *     //
 *     // asynchronous completion
 *     .perform(function(done) {
 *       console.log('elementValue', elementValue);
 *       // potentially other async stuff going on
 *       // on finished, call the done callback
 *       done();
 *     })
 *     //
 *     // asynchronous completion including api (client)
 *     .perform(function(client, done) {
 *       console.log('elementValue', elementValue);
 *       // similar to before, but now with client
 *       // potentially other async stuff going on
 *       // on finished, call the done callback
 *       done();
 *     });
 * };
 * ```
 *
 * @method perform
 * @param {function} callback The function to run as part of the queue. Its signature can have up to two parameters. No parameters: callback runs and perform completes immediately at the end of the execution of the callback. One parameter: allows for asynchronous execution within the callback providing a done callback function for completion as the first argument. Two parameters: allows for asynchronous execution with the "api" object passed in as the first argument, followed by the done callback.
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
      var args = [function() {
        self.emit('complete');
      }];

      if (callback.length > 1) {
        args.unshift(self.client.api);
      }

      callback.apply(self, args);
    };
  }

  process.nextTick(doneCallback);

  return this;
};

module.exports = Perform;
