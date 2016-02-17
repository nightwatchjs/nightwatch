var assert = require('assert');
var ExpectGlobals = require('../../../lib/globals/expect.js');
var Nocks = require('../../../lib/nocks.js');

module.exports = {
  'expect.enabled' : {
    beforeEach: function (done) {
      ExpectGlobals.beforeEach.call(this, done);
    },

    afterEach : function() {
      ExpectGlobals.afterEach.call(this);
    },
    
    'to be enabled [PASSED]': function (done) {
      Nocks.elementFound().enabled();
      var expect = this.client.api.expect.element('#weblogin').to.be.enabled;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.resultValue, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be enabled');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 0);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to be enabled');
        done();
      });

      this.client.start();
    },

    'to be enabled with waitFor [PASSED]': function (done) {
      Nocks.elementFound().enabled();

      var expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(100);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 100);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be enabled in 100ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });

      this.client.start();
    },

    'to be enabled with waitFor [FAILED]': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementFound().notEnabled(3);

      var expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be enabled in 60ms');
        done();
      });

      this.client.start();
    },

    'to be enabled [FAILED]': function (done) {
      Nocks.elementFound().notEnabled();

      var expect = this.client.api.expect.element('#weblogin').to.be.enabled;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'enabled');
        assert.equal(expect.assertion.actual, 'not enabled');
        assert.equal(expect.assertion.resultValue, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be enabled');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to be enabled');
        done();
      });

      this.client.start();
    },

    'to not be enabled [PASSED]': function (done) {
      Nocks.elementFound().notEnabled();

      var expect = this.client.api.expect.element('#weblogin').to.not.be.enabled;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.expected, 'not enabled');
        assert.equal(expect.assertion.actual, 'not enabled');
        assert.equal(expect.assertion.resultValue, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not be enabled');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 0);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to not be enabled');
        done();
      });

      this.client.start();
    },

    'to not be enabled [FAILED]': function (done) {
      Nocks.elementFound().enabled();

      var expect = this.client.api.expect.element('#weblogin').to.not.be.enabled;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'not enabled');
        assert.equal(expect.assertion.actual, 'enabled');
        assert.equal(expect.assertion.resultValue, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not be enabled');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to not be enabled');
        done();
      });

      this.client.start();
    },

    'to be enabled - element not found': function (done) {
      Nocks.elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.be.enabled;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'enabled');
        assert.equal(expect.assertion.actual, 'not found');
        assert.equal(expect.assertion.resultValue, null);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be enabled - element was not found');
        assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to be enabled - element was not found');
        done();
      });

      this.client.start();
    },

    'to not be enabled with waitFor [FAILED]': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementFound().enabled(4);

      var expect = this.client.api.expect.element('#weblogin').to.not.be.enabled.before(120);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 120);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not be enabled in 120ms');
        done();
      });

      this.client.start();
    },

    'to be enabled with waitFor - element not found': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound().elementNotFound().elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be enabled in 60ms - element was not found');
        done();
      });

      this.client.start();
    },

    'to be enabled with waitFor - element found on retry': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound().elementFound().enabled();

      var expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be enabled in 60ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });

      this.client.start();
    }

  }
};
