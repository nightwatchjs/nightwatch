exports.command = function(fileName, callback) {
  var self = this;
  return this.screenshot(function(result) {
    self.saveScreenshotToFile(fileName, result.value);
    if (typeof callback == "function") {
      callback(result);
    }
  });
};
