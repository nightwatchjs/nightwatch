/**
 * Closes the session. Uses session protocol command.
 * 
 * ```
 *    this.demoTest = function (client) {
 *      client.closeWindow();
 *    };
 * ```
 * 
 * @method closeWindow
 * @param {function} [callback] Optional callback function to be called when the command finishes. 
 *  The callback is called with the main instance as context and the result object as the argument.
 * @see protocol.window
 * @since v0.3.0
 * @api commands
 */
exports.command = function(callback) {
  var self = this;
  return this.session('delete', function(result) {
    self.sessionId = null;
    if (typeof callback == 'function') {
      callback.call(self);
    }
  });
};

