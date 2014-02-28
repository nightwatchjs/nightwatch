/**
 * Checks if the given element does not have the specified CSS class.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.cssClassNotPresent('#main', 'container');
 *    };
 * ```
 *
 * @method cssClassNotPresent
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} className The CSS class to look for.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
module.exports = function(selector, className, msg) {
  var self = this;
  return this.api.getAttribute(selector, 'class', function(result) {
    var passed, value = null;
    if (result === false || result && result.status === -1) {
      passed = false;
      msg = msg || ('Testing if element <' + selector + '> does not have css class: ' + className +
        '. Element could not be located.');
    } else {
      var classes = result.value.split(' ');
      value = result.value;
      passed = classes.indexOf(className) === -1;
      msg = msg || ('Testing if element <' + selector + '> does not have css class: ' + className);
    }

    self.client.assertion(passed, value, '!' + className, msg, self.abortOnFailure);
  });
};

