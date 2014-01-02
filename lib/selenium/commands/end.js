exports.command = function(callback) {
  var self = this;
  return this.session('delete', function(result) {
    self.sessionId = null;
    if (typeof callback == "function") {
      callback.call(self);
    }
  });
};

