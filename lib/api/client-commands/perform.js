/**
 * A simple perform command which allows access to the Nightwatch API in a callback. Can be useful if you want to read variables set by other commands.
 *
 * The callback signature can have up to two parameters.
 *  - no parameters: callback runs and perform completes immediately at the end of the execution of the callback.
 *  - one parameter: allows for asynchronous execution within the callback providing a done callback function for completion as the first argument.
 *  - two parameters: allows for asynchronous execution with the Nightwatch `api` object passed in as the first argument, followed by the done callback.
 *
 * In the case of asynchronous execution, the timeout can be controlled by setting the `asyncHookTimeout` global. See [Using test globals](https://nightwatchjs.org/gettingstarted/concepts/#using-test-globals) for more info.
 *
 * @example
 * describe('perform example', function() {
 *   var elementValue;
 *
 *   it('basic perform', function(browser) {
 *     browser
 *       .getValue('.some-element', function(result) {
 *         elementValue = result.value;
 *       })
 *       // other stuff going on ...
 *
 *       // self-completing callback
 *       .perform(function() {
 *         console.log('elementValue', elementValue);
 *         // without any defined parameters, perform
 *         // completes immediately (synchronously)
 *       })
 *
 *       // returning a Promise
 *       .perform(async function() {
 *         console.log('elementValue', elementValue);
 *         // potentially other async stuff going on
 *
 *         return elementValue;
 *       })
 *
 *       // DEPRECATED: asynchronous completion including api (client)
 *       .perform(function(client, done) {
 *         console.log('elementValue', elementValue);
 *         done();
 *     });
 *   });
 *
 *   it('perform with async', function(browser) {
 *     const result = await browser.perform(async function() {
 *       return 100;
 *     });
 *     console.log('result:', result); // 100
 *   })
 * }
 *
 *
 * @method perform
 * @param {function} callback The function to run as part of the queue.
 * @api protocol.utilities
 */
const {Actions} = require('selenium-webdriver/lib/input');
const EventEmitter = require('events');

class Perform extends EventEmitter {
  static get alwaysAsync() {
    return true;
  }

  static get avoidPrematureParentNodeResolution() {
    return true;
  }

  command(callback = function() {}) {
    let doneCallback;
    const asyncHookTimeout = this.client.settings.globals.asyncHookTimeout;

    this.timeoutId = setTimeout(() => {
      this.emit('error', new Error(`Timeout while waiting (${asyncHookTimeout}ms) for the .perform() command callback to be called.`));
    }, asyncHookTimeout);

    if (callback.length === 0) {
      let cbResult = this.runCallback(callback, [this.api]);

      // support for Selenium Actions API:
      // https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/input_exports_Actions.html
      if (cbResult instanceof Actions) {
        cbResult = cbResult.perform();
      }

      if (cbResult instanceof Promise) {
        clearTimeout(this.timeoutId);
        cbResult.then(async result => {
          if (result instanceof Actions) {
            result = await result.perform();
          }
          this.emit('complete', result);
        }).catch(err => {
          this.emit('error', err);
        });

        return this;
      }

      doneCallback = () => {
        clearTimeout(this.timeoutId);
        this.emit('complete', cbResult);
      };
    } else {
      doneCallback = () => {
        const args = [(result) => {
          clearTimeout(this.timeoutId);
          this.emit('complete', result);
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
      return cb.apply(this.api, args);
    } catch (err) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.emit('error', err);
    }
  }
}

module.exports = Perform;
