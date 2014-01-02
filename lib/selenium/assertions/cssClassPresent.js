function Assertion() {}
Assertion.prototype.command = function command(cssSelector, className, msg) {
  var self = this;
  return this.client.getAttribute(cssSelector, 'class', function(result) {
    var passed, value;
    if (result === false || result && result.status == -1) {
      passed = false;
      msg = msg || ('Testing if element <' + cssSelector + '> has css class: ' + className + '. Element could not be located.');
    } else {
      var classes = result.value.split(' ');
      value = result.value;
      passed = classes.indexOf(className) !== -1;
      msg = msg || ('Testing if element <' + cssSelector + '> has css class: ' + className);
    }
    
    self.client.assertion(passed, value, className, msg, self.abortOnFailure);
  });
};
module.exports = Assertion;

