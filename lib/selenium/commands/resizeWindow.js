/**
 * Resizes the current window.
 * 
 * @param {Number} width
 * @param {Number} height
 * @param {Function} callback
 */
exports.command = function(width, height, callback) {
  var self = this;
  return this.windowSize('current', width, height, function() {
    if (typeof callback == "function") {
      callback.call(self);
    }
  });
};

