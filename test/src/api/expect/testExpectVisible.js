var assert = require('assert');
var ExpectGlobals = require('../../../lib/globals/expect.js');
var Nocks = require('../../../lib/nocks.js');

module.exports = {
  'expect.visible' : {
    beforeEach: function (done) {
      ExpectGlobals.beforeEach.call(this, done);
    },

    afterEach : function() {
      ExpectGlobals.afterEach.call(this);
    },

    'to be visible [PASSED]': function (done) {
      Nocks.elementFound().visible();
      var expect = this.client.api.expect.element('#weblogin').to.be.visible;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.resultValue, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be visible');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 0);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to be visible');
        done();
      });

      this.client.start();
    },

    'to be visible with waitFor [PASSED]': function (done) {
      Nocks.elementFound().visible();

      var expect = this.client.api.expect.element('#weblogin').to.be.visible.before(100);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 100);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be visible in 100ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });

      this.client.start();
    },

    'to be visible with waitFor [FAILED]': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementFound().notVisible(3);

      var expect = this.client.api.expect.element('#weblogin').to.be.visible.before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be visible in 60ms');
        done();
      });

      this.client.start();
    },

    'to be visible [FAILED]': function (done) {
      Nocks.elementFound().notVisible();

      var expect = this.client.api.expect.element('#weblogin').to.be.visible;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'visible');
        assert.equal(expect.assertion.actual, 'not visible');
        assert.equal(expect.assertion.resultValue, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be visible');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to be visible');
        done();
      });

      this.client.start();
    },

    'to not be visible [PASSED]': function (done) {
      Nocks.elementFound().notVisible();

      var expect = this.client.api.expect.element('#weblogin').to.not.be.visible;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.expected, 'not visible');
        assert.equal(expect.assertion.actual, 'not visible');
        assert.equal(expect.assertion.resultValue, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not be visible');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 0);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to not be visible');
        done();
      });

      this.client.start();
    },

    'to not be visible [FAILED]': function (done) {
      Nocks.elementFound().visible();

      var expect = this.client.api.expect.element('#weblogin').to.not.be.visible;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'not visible');
        assert.equal(expect.assertion.actual, 'visible');
        assert.equal(expect.assertion.resultValue, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not be visible');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to not be visible');
        done();
      });

      this.client.start();
    },

    'to be visible - element not found': function (done) {
      Nocks.elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.be.visible;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'visible');
        assert.equal(expect.assertion.actual, 'not found');
        assert.equal(expect.assertion.resultValue, null);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be visible - element was not found');
        assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to be visible - element was not found');
        done();
      });

      this.client.start();
    },

    'to not be visible with waitFor [FAILED]': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 15;

      Nocks.elementFound().visible().visible();

      var expect = this.client.api.expect.element('#weblogin').to.not.be.visible.before(25);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 25);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not be visible in 25ms');
        assert.equal(expect.assertion.passed, false);
        done();
      });

      this.client.start();
    },

    'to not be visible with waitFor [PASSED] - element not visible on retry': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 10;

      Nocks.elementFound().visible().notVisible().notVisible();

      var expect = this.client.api.expect.element('#weblogin').to.not.be.visible.before(30);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 30);
        assert.equal(expect.assertion.message.indexOf('Expected element <#weblogin> to not be visible in 30ms'), 0);
        assert.equal(expect.assertion.passed, true, 'Assertion has passed');
        done();
      });

      this.client.start();
    },

    'to be visible with waitFor - element not found': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound().elementNotFound().elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.be.visible.before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be visible in 60ms - element was not found');
        done();
      });

      this.client.start();
    },

    'to be visible with waitFor - element found on retry': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound().elementFound().visible();

      var expect = this.client.api.expect.element('#weblogin').to.be.visible.before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be visible in 60ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });

      this.client.start();
    }

  }
};
