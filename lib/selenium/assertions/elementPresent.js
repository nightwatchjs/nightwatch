function Assertion() {}
Assertion.prototype.command = function command(cssSelector, message) {
  var self = this;
  var msg = (message && message !== '') ? message : 'Testing if element <' + cssSelector + '> is present.';
  
  return this.client.element("css selector", cssSelector, function(result) {
    var value = null;
    if (result.status == 0) {
      value = result.value.ELEMENT;
    }
    self.client.assertion(value !== null, value, true, msg, self.abortOnFailure);
  });
};
module.exports = Assertion;
