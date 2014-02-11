/**
 * Change focus to another window. The window to change focus to may be specified 
 * by its server assigned window handle, or by the value of its name attribute.
 * 
 * @param {String} handleOrName The window to change focus to.
 * @param {Function} callback
 */
exports.command = function(handleOrName, callback) {
  var self = this;
  return this.window('POST', handleOrName, function(result) {
    
    if (typeof callback == "function") {
      callback.call(self, result);
    }
  });
};

