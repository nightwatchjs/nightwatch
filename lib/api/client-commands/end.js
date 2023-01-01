const EventEmitter = require('events');

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
  command(forceEnd = !this.reuseBrowser, callback) {

    if (arguments.length === 1 && typeof arguments[0] === 'function') {
      callback = forceEnd;
      forceEnd = !this.reuseBrowser;
    }

    const client = this.client;

    if (this.api.sessionId && forceEnd) {
      this.api.session('delete', result => {
        client.sessionId = null;
        client.setApiProperty('sessionId', null);

        this.client.transport.closeDriver('FINISHED').then(() => {
          this.complete(callback, result);
        });
      });
    } else {
      setImmediate(() => {
        this.complete(callback, null);
      });
    }

    return this.client.api;
  }

  complete(callback, response) {
    let result;
    if (typeof callback === 'function') {
      result = callback.call(this.api, response);
    }

    this.emit('complete', result);
  }
}

module.exports = End;
