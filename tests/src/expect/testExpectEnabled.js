var Nocks = require('../../nocks.js');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    callback();
  },

  'to be enabled [PASSED]' : function(test) {
    Nocks.elementFound().enabled();
    var expect = this.client.api.expect.element('#weblogin').to.be.enabled;
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.resultValue, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be enabled');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 1);
      test.equals(results.failed, 0);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to be enabled');
      test.done();
    })
  },

  'to be enabled with waitFor [PASSED]' : function(test) {
    Nocks.elementFound().enabled();

    var expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(100);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 100);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be enabled in 100ms - condition was met in '+ expect.assertion.elapsedTime +'ms');
      test.done();
    })
  },

  'to be enabled with waitFor [FAILED]' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().notEnabled(3);

    var expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(60);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be enabled in 60ms');
      test.done();
    })
  },

  'to be enabled [FAILED]' : function(test) {
    Nocks.elementFound().notEnabled();

    var expect = this.client.api.expect.element('#weblogin').to.be.enabled;
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'enabled');
      test.equals(expect.assertion.actual, 'not enabled');
      test.equals(expect.assertion.resultValue, false);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be enabled');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to be enabled');
      test.done();
    })
  },

  'to not be enabled [PASSED]' : function(test) {
    Nocks.elementFound().notEnabled();

    var expect = this.client.api.expect.element('#weblogin').to.not.be.enabled;
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.expected, 'not enabled');
      test.equals(expect.assertion.actual, 'not enabled');
      test.equals(expect.assertion.resultValue, false);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to not be enabled');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 1);
      test.equals(results.failed, 0);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to not be enabled');
      test.done();
    })
  },

  'to not be enabled [FAILED]' : function(test) {
    Nocks.elementFound().enabled();

    var expect = this.client.api.expect.element('#weblogin').to.not.be.enabled;
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'not enabled');
      test.equals(expect.assertion.actual, 'enabled');
      test.equals(expect.assertion.resultValue, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to not be enabled');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to not be enabled');
      test.done();
    })
  },

  'to be enabled - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.be.enabled;
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'enabled');
      test.equals(expect.assertion.actual, 'not found');
      test.equals(expect.assertion.resultValue, null);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be enabled - element was not found');
      test.deepEqual(expect.assertion.messageParts, [' - element was not found']);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to be enabled - element was not found');
      test.done();
    })
  },

  'to not be enabled with waitFor [FAILED]' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().enabled(4);

    var expect = this.client.api.expect.element('#weblogin').to.not.be.enabled.before(120);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 120);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to not be enabled in 120ms');
      test.done();
    })
  },

  'to be enabled with waitFor - element not found' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(60);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be enabled in 60ms - element was not found');
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
