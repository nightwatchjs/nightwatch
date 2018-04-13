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

const EventEmitter = require('events');

class Perform extends EventEmitter {
  command(callback) {
    let doneCallback;
    let asyncHookTimeout = this.client.settings.globals.asyncHookTimeout;

    this.timeoutId = setTimeout(function() {
      throw new Error(`Timeout while waiting (${asyncHookTimeout}ms) for the .perform() command callback to be called.`);
    }, asyncHookTimeout);

    if (callback.length === 0) {
      this.runCallback(callback, [this.api]);

      doneCallback = () => {
        clearTimeout(this.timeoutId);
        this.emit('complete');
      };
    } else {
      doneCallback = () => {
        let args = [() => {
          clearTimeout(this.timeoutId);
          this.emit('complete');
        }];

        if (callback.length > 1) {
          args.unshift(this.api);
        }

        this.runCallback(callback, args);
      };
    }

    process.nextTick(doneCallback);

    return this;
  }

  runCallback(cb, args) {
    try {
      cb.apply(this.api, args);
    } catch (err) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.emit('error', err)
    }
  }
}

module.exports = Perform;
