/**
 * Close the current window.
 * 
 * @param {Function} callback
 */
exports.command = function(callback) {
  var self = this;
  return this.window('DELETE', function() {
    if (typeof callback == "function") {
      callback.call(self);
    }
  });
};

