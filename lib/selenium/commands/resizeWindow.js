/**
 * Close the current window.
 * 
 * @param {Function} callback
 */
exports.command = function(width, number, callback) {
  var self = this;
  return this.windowSize('current', width, number, function() {
    if (typeof callback == "function") {
      callback.call(self);
    }
  });
};

