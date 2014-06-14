/**
 * Simple example of custom command. This command will
 * check if there's a onbeforeunload handler in the target web page
 * and return the result
 */
/* global window */

module.exports.command = function(callback) {
  var self = this;

  this.execute(function() {
    return window && typeof window.onbeforeunload === 'function';
  }, [], function(result) {
    callback.call(self, result.value);
  });

  return this;
};
