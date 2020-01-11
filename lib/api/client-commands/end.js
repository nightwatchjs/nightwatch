const EventEmitter = require('events');
const {Logger, Screenshots} = require('../../utils');

/**
 * Ends the session. Uses session protocol command.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.end();
 * };
 *
 * @method end
 * @syntax .end([callback])
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see session
 * @api protocol.sessions
 */
class End extends EventEmitter {
  command(callback) {
    const client = this.client;

    if (this.api.sessionId) {
      if (this.testFailuresExist() && this.shouldTakeScreenshot()) {
        Logger.info(`Failures in "${this.api.currentTest.name}". Taking screenshot...`);

        const prefix = `${this.api.currentTest.module}/${this.api.currentTest.name}`;
        const fileNamePath = Screenshots.getFileName(prefix, false, client.options.screenshots.path);

        this.api.saveScreenshot(fileNamePath, (result, err) => {
          if (!err && this.client.transport.isResultSuccess(result))  {
            const assertions = this.api.currentTest.results.assertions || [];
            if (assertions.length > 0) {
              const currentAssertion = assertions[assertions.length-1];
              if (currentAssertion) {
                currentAssertion.screenshots = currentAssertion.screenshots || [];
                currentAssertion.screenshots.push(fileNamePath);
              }
            }
          } else {
            Logger.warn('Error saving screenshot...', err || result);
          }
        });
      }

      this.api.session('delete', result => {
        client.session.clearSession();
        client.setApiProperty('sessionId', null);

        this.complete(callback, result);
      });
    } else {
      setImmediate(() => {
        this.complete(callback, null);
      });
    }

    return this.client.api;
  }

  testFailuresExist() {
    let currentTest = this.api.currentTest || {};

    if (currentTest.results) {
      return currentTest.results.errors > 0 || currentTest.results.failed > 0;
    }

    return null;
  }

  shouldTakeScreenshot() {
    return this.api.options.screenshots.enabled && this.api.options.screenshots.on_failure;
  }

  complete(callback, result) {
    if (typeof callback === 'function') {
      callback.call(this.api, result);
    }

    this.emit('complete');
  }
}

module.exports = End;
