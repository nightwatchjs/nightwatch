const events = require('events');
const Logger = require('../../util/logger.js');
const Screenshots = require('../../testsuite/screenshots.js');

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
 * @syntax .end([callback])
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see session
 * @api commands
 */
class End extends events.EventEmitter {
  command(callback) {
    let client = this.client;

    if (this.api.sessionId) {
      if (this.testFailuresExist() && this.shouldTakeScreenshot()) {
        let fileNamePath = Screenshots.getScreenshotFileName(client.api.currentTest, false, client.options.screenshots.path);
        Logger.info('Failures in "' + this.api.currentTest.name + '". Taking screenshot...');

        this.api.saveScreenshot(fileNamePath, (result, err) => {
          if (err || !this.client.transport.isResultSuccess(result))  {
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
