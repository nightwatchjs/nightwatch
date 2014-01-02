function Assertion() {}
Assertion.prototype.command = function command(cssSelector, attribute, expected, msg) {
  var self = this;
  return this.client.getAttribute(cssSelector, attribute, function(result) {
    var passed, value = null;
    if (result === false || result && result.status == -1) {
      passed = false;
      msg = msg || ('Testing if element <' + cssSelector + '> has attribute ' + attribute + '. Element or attribute could not be located.');
    } else {
      passed = result.value === expected;
      value = result.value;
      msg = msg || ('Testing if element <' + cssSelector + '> has attribute: ' + attribute + ' = "' + expected + '"');
    }
    
    self.client.assertion(passed, value, expected, msg, self.abortOnFailure);
  });
};
module.exports = Assertion;
