const assert = require('assert');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const Nocks = require('../../../lib/nocks.js');

describe('expect.elements count', function() {

  describe('with backwards compat mode', function() {
    beforeEach(function(done) {
      ExpectGlobals.beforeEach.call(this, {
        backwards_compatibility_mode: true,
        output: false,
        silent: false
      }, () => {
        this.client.api.globals.abortOnAssertionFailure = false;
        done();
      });
    });

    afterEach(function(done) {
      Nocks.cleanAll();
      ExpectGlobals.afterEach.call(this, done);
    });

    it('count to equal [PASSED]', function() {
      Nocks.elementsFound('.classname');
      let expect = this.client.api.expect.elements('.classname').count.to.equal(4);

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to equal: "4"'), expect.assertion.message);
      });
    });

    it('count to equal [FAILED]', function() {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementsFound('.classname');
      Nocks.elementsFound('.classname');

      let expect = this.client.api.expect.elements('.classname').count.to.equal(5);

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.expected, 'equal \'5\'');
        assert.strictEqual(expect.assertion.negate, false);
        assert.strictEqual(expect.assertion.actual, 4);
        assert.strictEqual(expect.assertion.resultValue, 4);
        assert.strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.messageParts.includes(' equal: "5"'));
        assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to equal: "5"'), expect.assertion.message);
      });
    });
  });

  describe('without compat mode', function() {
    beforeEach(function(done) {
      ExpectGlobals.beforeEach.call(this, {
        silent: false,
        output: false
      }, () => {
        this.client.api.globals.abortOnAssertionFailure = false;
        done();
      });
    });

    afterEach(function(done) {
      Nocks.cleanAll();
      ExpectGlobals.afterEach.call(this, done);
    });

    it('count to equal [PASSED]', function() {
      Nocks.elementsFound('.classname');
      let expect = this.client.api.expect.elements('.classname').count.to.equal(4);

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.passed, true);
        assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to equal: "4"'), expect.assertion.message);
      });
    });

    it('count to equal [FAILED]', function() {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementsFound('.classname');
      Nocks.elementsFound('.classname');

      let expect = this.client.api.expect.elements('.classname').count.to.equal(5);

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.expected, 'equal \'5\'');
        assert.strictEqual(expect.assertion.negate, false);
        assert.strictEqual(expect.assertion.actual, 4);
        assert.strictEqual(expect.assertion.resultValue, 4);
        assert.strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.messageParts.includes(' equal: "5"'));
        assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to equal: "5"'), expect.assertion.message);
      });
    });

    it('count to NOT equal [PASSED]', function() {
      Nocks.elementsFound('.classname');

      let expect = this.client.api.expect.elements('.classname').count.to.not.equal(888);

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.negate, true);
        assert.strictEqual(expect.assertion.passed, true);
        assert.strictEqual(expect.assertion.resultValue, 4);
        assert.strictEqual(expect.assertion.messageParts[0], ' not equal: "888"');
        assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to not equal: "888"'));
      });
    });

    it('count to NOT equal [FAILED]', function() {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementsFound('.classname');
      Nocks.elementsFound('.classname');

      let expect = this.client.api.expect.elements('.classname').count.to.not.equal(4);

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.expected, 'not equal \'4\'');
        assert.strictEqual(expect.assertion.negate, true);
        assert.strictEqual(expect.assertion.actual, 4);
        assert.strictEqual(expect.assertion.resultValue, 4);
        assert.strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to not equal: "4"'));
      });
    });

    it('count to equal with waitFor [PASSED]', function() {
      this.client.api.globals.waitForConditionPollInterval = 50;
      Nocks.elementsNotFound('.classname');
      Nocks.elementsFound('.classname');

      let expect = this.client.api.expect.elements('.classname').count.to.equal(4).before(100);

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.waitForMs, 100);
        assert.strictEqual(expect.assertion.passed, true);
        assert.strictEqual(expect.assertion.retries, 1);
        assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to equal: "4" in 100ms (' + expect.assertion.elapsedTime + 'ms)'));
      });
    });

    it('count to equal and waitFor [FAILED] - count not equal', function() {
      this.client.api.globals.waitForConditionPollInterval = 100;

      Nocks.elementsFound('.classname');
      Nocks.elementsFound('.classname');
      Nocks.elementsFound('.classname');

      let expect = this.client.api.expect.elements('.classname').count.to.equal(888).before(105);

      return this.client.start(function() {
        assert.strictEqual(expect.assertion.waitForMs, 105);
        assert.strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.retries >= 1);
        assert.ok(expect.assertion.elapsedTime >= 105);
        assert.strictEqual(expect.assertion.expected, 'equal \'888\'');
        assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to equal: "888" in 105ms'), expect.assertion.message);
      });
    });

    it('count to equal - element not found', function() {
      this.client.api.globals.waitForConditionTimeout = 40;
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementsNotFound('.classname');
      Nocks.elementsNotFound('.classname');

      let expect = this.client.api.expect.elements('.classname').count.to.equal(4);

      return this.client.start(function() {
        assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to'));
        assert.strictEqual(expect.assertion.expected, 'equal \'4\'');
        assert.strictEqual(expect.assertion.negate, false);
        assert.strictEqual(expect.assertion.passed, false);
        assert.ok(expect.assertion.messageParts.includes(' equal: "4"'));
        assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to equal: "4"'));
        assert.strictEqual(expect.assertion.resultValue, 0);
      });
    });
  });
});
