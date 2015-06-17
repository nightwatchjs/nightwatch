var util = require('util');
var events = require('events');
var Utils = require('../../util/utils.js');
var Logger = require('../../util/logger.js');

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
    if (this.testFailuresExist() && this.shouldTakeScreenshot()) {
      var fileNamePath = Utils.getScreenshotFileName(client.api.currentTest.module + '/' +client.api.currentTest.name, client.options.screenshots.path);
      Logger.info('We have failures in "' + client.api.currentTest.name + '". Taking screenshot...');

      client.api.saveScreenshot(fileNamePath, function(result, err) {
        if (err || result.status !== 0)  {
          Logger.warn('Error saving screenshot...', err || result);
        }
      });
    }

    client.api.session('delete', function(result) {
      client.sessionId = client.api.sessionId = null;
      self.complete(callback, result);
    });
  } else {
    setImmediate(function() {
      self.complete(callback, null);
    });
  }

  return this.client.api;
};

End.prototype.testFailuresExist = function() {
  return this.client.results.errors > 0 || this.client.results.failed > 0;
};

End.prototype.shouldTakeScreenshot = function() {
  return this.client.options.screenshots.enabled && this.client.options.screenshots.on_failure;
};

End.prototype.complete = function(callback, result) {
  this.emit('complete');
  if (typeof callback === 'function') {
    callback.call(this, result);
  }
};

module.exports = End;
