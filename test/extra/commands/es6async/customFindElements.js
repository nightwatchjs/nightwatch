module.exports.command = function(selector, callback = function() {}) {
  this.findElements({
    selector,
    suppressNotFoundErrors: true
  }, function(result) {
    callback(result.value);
  });
};