function Assertion() {}
Assertion.prototype.command = function(expected, msg) {
  var self = this;
  return this.client.title(function(result) {
    var passed = result.value === expected;
    msg = msg || ('Testing if the page title equals "' + expected + '".');
    self.client.assertion(passed, result.value, expected, msg, self.abortOnFailure);
  });
};

module.exports = Assertion;
