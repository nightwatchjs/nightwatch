/**
 * Suspends the test for the given time in milliseconds. If the milliseconds argument is missing
 * it will suspend the test indefinitely
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.pause(1000);
 *    };
 * ```
 *
 * @method pause
 * @param {number} ms The number of milliseconds to wait.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api commands
 */
module.exports.command = function(ms, cb) {
  var self = this;
  // If we don't pass the milliseconds, the client will
  // be suspended indefinitely
  if (!ms) {
    return this;
  }
  setTimeout(function() {
    // if we have a callback, call it right before the complete event
    if (cb) {
      cb.call(self.client);
    }

    self.emit('complete');
  }, ms);

  return this;
};
