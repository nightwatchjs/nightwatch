function Assertion() {}
Assertion.prototype.command =  function command(cssSelector, expectedText, msg) {
  var self = this;
  return this.client.getValue(cssSelector, function(result) {
    var passed, value = null;
    if (result === false || result && result.status == -1) {
      passed = false;
      msg = msg || ('Testing if element <' + cssSelector + '> contains text: ' + expectedText + '. Element could not be located.');
    } else {
      passed = result.value.indexOf(expectedText) !== -1;
      value = result.value;
      msg = msg || ('Testing if element <' + cssSelector + '> contains text: ' + expectedText);
    }
    
    self.client.assertion(passed, value, expectedText, msg, self.abortOnFailure);
  });
};
module.exports = Assertion;
