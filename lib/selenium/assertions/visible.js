function Assertion() {}
Assertion.prototype.command = function command(cssSelector, msg) {
  var self = this;
  return this.client.isVisible(cssSelector, function(result) {
    var passed;
    if (result === false || result && result.status == -1) {
      passed = false;
      msg = msg || ('Testing if element <' + cssSelector + '> is visible. Element could not be located.');
    } else {
      passed = result.value === true;
      msg = msg || ('Testing if element <' + cssSelector + '> is visible.');
    }
    
    self.client.assertion(passed, passed, true, msg, self.abortOnFailure);
  });
};
module.exports = Assertion;

