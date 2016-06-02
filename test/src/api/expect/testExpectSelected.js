var assert = require('assert');
var ExpectGlobals = require('../../../lib/globals/expect.js');
var Nocks = require('../../../lib/nocks.js');

module.exports = {
  'expect.selected' : {
    beforeEach: function (done) {
      ExpectGlobals.beforeEach.call(this, done);
    },

    afterEach : function() {
      ExpectGlobals.afterEach.call(this);
    },

    'to be selected [PASSED]': function (done) {
      Nocks.elementFound().selected();
      var expect = this.client.api.expect.element('#weblogin').to.be.selected;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.resultValue, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be selected');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 0);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to be selected');
        done();
      });

      this.client.start();
    },

    'to be selected with waitFor [PASSED]': function (done) {
      Nocks.elementFound().selected();

      var expect = this.client.api.expect.element('#weblogin').to.be.selected.before(100);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 100);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be selected in 100ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });

      this.client.start();
    },

    'to be selected with waitFor [FAILED]': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementFound().notSelected(3);

      var expect = this.client.api.expect.element('#weblogin').to.be.selected.before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be selected in 60ms');
        done();
      });

      this.client.start();
    },

    'to be selected [FAILED]': function (done) {
      Nocks.elementFound().notSelected();

      var expect = this.client.api.expect.element('#weblogin').to.be.selected;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'selected');
        assert.equal(expect.assertion.actual, 'not selected');
        assert.equal(expect.assertion.resultValue, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be selected');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to be selected');
        done();
      });

      this.client.start();
    },

    'to not be selected [PASSED]': function (done) {
      Nocks.elementFound().notSelected();

      var expect = this.client.api.expect.element('#weblogin').to.not.be.selected;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.expected, 'not selected');
        assert.equal(expect.assertion.actual, 'not selected');
        assert.equal(expect.assertion.resultValue, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not be selected');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 0);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to not be selected');
        done();
      });

      this.client.start();
    },

    'to not be selected [FAILED]': function (done) {
      Nocks.elementFound().selected();

      var expect = this.client.api.expect.element('#weblogin').to.not.be.selected;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'not selected');
        assert.equal(expect.assertion.actual, 'selected');
        assert.equal(expect.assertion.resultValue, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not be selected');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to not be selected');
        done();
      });

      this.client.start();
    },

    'to be selected - element not found': function (done) {
      Nocks.elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.be.selected;
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'selected');
        assert.equal(expect.assertion.actual, 'not found');
        assert.equal(expect.assertion.resultValue, null);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be selected - element was not found');
        assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to be selected - element was not found');
        done();
      });

      this.client.start();
    },

    'to not be selected with waitFor [FAILED]': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementFound().selected(3);

      var expect = this.client.api.expect.element('#weblogin').to.not.be.selected.before(120);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 120);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not be selected in 120ms');
        done();
      });

      this.client.start();
    },

    'to be selected with waitFor - element not found': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound().elementNotFound().elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.be.selected.before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be selected in 60ms - element was not found');
        done();
      });

      this.client.start();
    },

    'to be selected with waitFor - element found on retry': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound().elementFound().selected();

      var expect = this.client.api.expect.element('#weblogin').to.be.selected.before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be selected in 60ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });

      this.client.start();
    }
  }
};
