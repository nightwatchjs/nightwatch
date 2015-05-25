var Nocks = require('../../nocks.js');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    callback();
  },

  tearDown : function(callback) {
    this.client = null;
    callback();
  },

  'to have css property [PASSED]' : function(test) {
    Nocks.elementFound().cssProperty('block');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.cssProperty, 'display');
      test.equals(expect.assertion.resultValue, 'block');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display"');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 1);
      test.equals(results.failed, 0);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to have css property "display"');
      test.done();
    });
  },

  'to have attribute with waitFor [PASSED]' : function(test) {
    Nocks.elementFound().cssProperty('block');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').before(100);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 100);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" in 100ms - property was present in '+ expect.assertion.elapsedTime +'ms');
      test.done();
    })
  },
};
