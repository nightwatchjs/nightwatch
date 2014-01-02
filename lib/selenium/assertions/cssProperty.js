function Assertion() {}
Assertion.prototype.command = function command(cssSelector, cssProperty, expected, msg) {
  var self = this;
  return this.client.getCssProperty(cssSelector, cssProperty, function(result) {
    var passed, value = null;
    if (result === false || result && result.status == -1) {
      passed = false;
      msg = msg || ('Testing if element <' + cssSelector + '> has css property ' + cssProperty + '. Element or attribute could not be located.');
    } else {
      passed = result.value === expected;
      value = result.value;
      msg = msg || ('Testing if element <' + cssSelector + '> has css property: ' + cssProperty + ' = "' + expected + '"');
    }
    
    self.client.assertion(passed, value, expected, msg, self.abortOnFailure);
  });
};
module.exports = Assertion;
