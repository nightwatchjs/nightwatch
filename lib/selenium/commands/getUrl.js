exports.command = function(callback) {
  var self = this;
  return this.runCommand('url', [], function(result) {
    callback.call(self, result.value);
  });
};

