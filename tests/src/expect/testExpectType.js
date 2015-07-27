var Nocks = require('../../nocks.js');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    callback();
  },

  'to be [PASSED]' : function(test) {
    Nocks.elementFound().name('input');
    var expect = this.client.api.expect.element('#weblogin').to.be.an('input');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.article, 'an');
      test.equals(expect.assertion.resultValue, 'input');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be an input');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 1);
      test.equals(results.failed, 0);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to be an input');
      test.done();
    })
  },

  'to be [FAILED]' : function(test) {
    Nocks.elementFound().name('input');

    var expect = this.client.api.expect.element('#weblogin').to.be.an('input');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'be an input');
      test.equals(expect.assertion.actual, null);
      test.equals(expect.assertion.article, 'an');
      test.equals(expect.assertion.resultValue, null);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be an input');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to be an input');
      test.done();
    })
  },

  'to not be [PASSED]' : function(test) {
    Nocks.elementFound().name('input');

    var expect = this.client.api.expect.element('#weblogin').to.not.be.a('div');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.article, 'a');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.expected, 'not be a div');
      test.equals(expect.assertion.actual, 'input');
      test.equals(expect.assertion.resultValue, 'input');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to not be a div');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 1);
      test.equals(results.failed, 0);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to not be a div');
      test.done();
    })
  },

  'to be [FAILED]' : function(test) {
    Nocks.elementFound().name('div');

    var expect = this.client.api.expect.element('#weblogin').to.be.an('input');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'be an input');
      test.equals(expect.assertion.actual, 'div');
      test.equals(expect.assertion.resultValue, 'div');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be an input');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to be an input');
      test.done();
    })
  },

  'to not be - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.be.an('input');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.resultValue, null);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be an input - element was not found');
      test.deepEqual(expect.assertion.messageParts, [' - element was not found']);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to be an input - element was not found');
      test.done();
    })
  },

  'to not be - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.be.an('input');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.resultValue, null);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be an input - element was not found');
      test.deepEqual(expect.assertion.messageParts, [' - element was not found']);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to be an input - element was not found');
      test.done();
    })
  },

  'to be with message [PASSED]' : function(test) {
    Nocks.elementFound().name('input');

    var expect = this.client.api.expect.element('#weblogin').to.be.an('input', 'weblogin should be an input');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.article, 'an');
      test.equals(expect.assertion.resultValue, 'input');
      test.equals(expect.assertion.message, 'weblogin should be an input');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 1);
      test.equals(results.failed, 0);
      test.equals(results.tests[0].message, 'weblogin should be an input');
      test.done();
    })
  },

  'to be with message [FAILED]' : function(test) {
    Nocks.elementFound().name('div');

    var expect = this.client.api.expect.element('#weblogin').to.be.an('input', 'weblogin should be an input');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'be an input');
      test.equals(expect.assertion.actual, 'div');
      test.equals(expect.assertion.article, 'an');
      test.equals(expect.assertion.resultValue, 'div');
      test.equals(expect.assertion.message, 'weblogin should be an input');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'weblogin should be an input');
      test.done();
    })
  },

  'to be with message - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.be.an('input', 'weblogin should be an input');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.resultValue, null);
      test.equals(expect.assertion.message, 'weblogin should be an input - element was not found');
      test.deepEqual(expect.assertion.messageParts, [' - element was not found']);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'weblogin should be an input - element was not found');
      test.done();
    })
  },

  'to be with waitFor - element not found' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.be.an('input').before(60);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be an input in 60ms - element was not found');
      test.done();
    })
  },

  'to be with waitFor - element found on retry' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementFound().name('input');

    var expect = this.client.api.expect.element('#weblogin').to.be.an('input').before(60);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to be an input in 60ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
      test.done();
    })
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
