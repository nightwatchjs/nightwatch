exports.command = function(callback) {
  var self = this;
  return this.runCommand('title', [], function(result) {
    callback.call(self, result.value);
  });
};

