var Nocks = require('../../nocks.js');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    callback();
  },

  'to be present [PASSED]' : function(test) {
    Nocks.elementFound();
    var expect = this.client.api.expect.element('#weblogin').to.be.present;
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be present');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 1);
      test.equals(results.failed, 0);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to be present');
      test.done();
    })
  },

  'to be present with waitFor [PASSED]' : function(test) {
    Nocks.elementFound();

    var expect = this.client.api.expect.element('#weblogin').to.be.present.before(100);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 100);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be present in 100ms - element was present in '+ expect.assertion.elapsedTime +'ms');
      test.done();
    })
  },

  'to be present with waitFor [FAILED]' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.be.present.before(60);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be present in 60ms - element was not found');
      test.done();
    })
  },

  'to be present [FAILED]' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.be.present;
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be present - element was not found');
      test.deepEqual(expect.assertion.elementResult, null);
      test.deepEqual(expect.assertion.messageParts, [ ' - element was not found' ]);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to be present - element was not found');
      test.done();
    })
  },

  'to not be present [FAILED]' : function(test) {
    Nocks.elementFound();

    var expect = this.client.api.expect.element('#weblogin').to.not.be.present;
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'not present');
      test.equals(expect.assertion.actual, 'present');
      test.equals(typeof expect.assertion.resultValue, 'undefined');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to not be present');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to not be present');
      test.done();
    })
  },


  'to be present - xpath via useXpath [PASSED]' : function(test) {
    Nocks.elementFoundXpath();

    this.client.api.useXpath();
    var expect = this.client.api.expect.element('//weblogin').to.be.present;
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '//weblogin');
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <//weblogin> to be present');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.equals(results.passed, 1);
      test.equals(results.failed, 0);
      test.done();
    })
  },

  'to be present - xpath via argument [PASSED]' : function(test) {
    Nocks.elementFoundXpath();

    var expect = this.client.api.expect.element('//weblogin', 'xpath').to.be.present;
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '//weblogin');
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <//weblogin> to be present');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.equals(results.passed, 1);
      test.equals(results.failed, 0);
      test.done();
    })
  },

  tearDown : function(callback) {
    this.client = null;
    Nocks.cleanAll();
    // clean up
    callback();
  }
};
