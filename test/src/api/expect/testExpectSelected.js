const assert = require('assert');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const Nocks = require('../../../lib/nocks.js');
const {strictEqual} = assert;

describe('expect.selected', function() {
  beforeEach(function(done) {
    ExpectGlobals.beforeEach.call(this, {
      globals: {
        abortOnAssertionFailure: false
      }
    }, () => {
      done();
    });
  });

  afterEach(function(done) {
    Nocks.cleanAll();
    ExpectGlobals.afterEach.call(this, done);
  });

  const {runExpectAssertion} = ExpectGlobals;

  it('to be selected [PASSED]', function() {
    Nocks.elementFound().selected();

    return runExpectAssertion.call(this, {
      element: '#weblogin',
      fn(expect) {
        expect.to.be.selected;
      },
      assertion({selector, negate, passed, resultValue, message, messageParts, elapsedTime}) {
        strictEqual(selector, '#weblogin');
        strictEqual(negate, false);
        strictEqual(passed, true);
        strictEqual(resultValue, true);
        strictEqual(message, `Expected element <#weblogin> to be selected (${elapsedTime}ms)`);
        strictEqual(messageParts.length, 1, messageParts);
      }
    });
  });

  it('to be selected with waitFor [PASSED]', function() {
    Nocks.elementFound().selected();

    return runExpectAssertion.call(this, {
      element: '#weblogin',
      fn(expect) {
        expect.to.be.selected.before(100);
      },
      assertion({waitForMs, passed, message, elapsedTime}) {
        strictEqual(waitForMs, 100);
        strictEqual(passed, true);
        strictEqual(message, `Expected element <#weblogin> to be selected in 100ms (${elapsedTime}ms)`);
      }
    });
  });

  it('to be selected with waitFor [FAILED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().notSelected(3);

    let expect = this.client.api.expect.element('#weblogin').to.be.selected.before(60);

    return this.client.start(function() {
      const {elapsedTime, waitForMs, passed, message} = expect.assertion;

      assert.strictEqual(waitForMs, 60);
      assert.strictEqual(passed, false);
      assert.strictEqual(message, `Expected element <#weblogin> to be selected in 60ms - expected "selected" but got: "not selected" (${elapsedTime}ms)`);
    });
  });

  it('to be selected [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .notSelected()
      .notSelected()
      .notSelected();

    return runExpectAssertion.call(this, {
      element: '#weblogin',
      fn(expect) {
        expect.to.be.selected;
      },
      assertion({waitForMs, selector, actual, negate, resultValue, expected, passed, message, elapsedTime}) {
        strictEqual(selector, '#weblogin');
        strictEqual(negate, false);
        strictEqual(waitForMs, 40);
        strictEqual(passed, false);
        strictEqual(expected, 'selected');
        strictEqual(actual, 'not selected');
        strictEqual(resultValue, false);
        strictEqual(message, `Expected element <#weblogin> to be selected - expected "selected" but got: "not selected" (${elapsedTime}ms)`);
      }
    });
  });

  it('to not be selected [PASSED]', function() {
    Nocks.elementFound().notSelected();

    let expect = this.client.api.expect.element('#weblogin').to.not.be.selected;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, true);
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.expected, 'not selected');
      assert.strictEqual(expect.assertion.actual, 'not selected');
      assert.strictEqual(expect.assertion.resultValue, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be selected'));
      assert.strictEqual(expect.assertion.messageParts.length, 1);
    });
  });

  it('to not be selected [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .selected()
      .selected()
      .selected();

    let expect = this.client.api.expect.element('#weblogin').to.not.be.selected;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, true);
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.expected, 'not selected');
      assert.strictEqual(expect.assertion.actual, 'selected');
      assert.strictEqual(expect.assertion.resultValue, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be selected'));
      assert.strictEqual(expect.assertion.messageParts.length, 2);
    });
  });

  it('to be selected - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    const expect = this.client.api.expect.element('#weblogin').to.be.selected;

    return this.client.start(function() {
      const {elapsedTime, selector, negate, waitForMs, passed, expected, actual, message} = expect.assertion;

      assert.strictEqual(selector, '#weblogin');
      assert.strictEqual(negate, false);
      assert.strictEqual(waitForMs, 40);
      assert.strictEqual(passed, false);
      assert.strictEqual(expected, 'selected');
      assert.strictEqual(actual, 'not found');
      assert.strictEqual(message, `Expected element <#weblogin> to be selected - element was not found - expected "selected" but got: "not found" (${elapsedTime}ms)`);
      assert.ok(expect.assertion.messageParts.includes(' - element was not found'));
    });
  });

  it('to not be selected with waitFor [FAILED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().selected(3);

    let expect = this.client.api.expect.element('#weblogin').to.not.be.selected.before(120);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 120);
      assert.strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be selected in 120ms'));
    });
  });

  it('to be selected with waitFor - element not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.selected.before(60);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 60);
      assert.strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be selected in 60ms - element was not found'));
    });
  });

  it('to be selected with waitFor - element found on retry', function() {
    this.client.api.globals.waitForConditionPollInterval = 100;

    Nocks
      .elementNotFound()
      .elementFound()
      .selected();

    let expect = this.client.api.expect.element('#weblogin').to.be.selected.before(111);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 111);
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.message, 'Expected element <#weblogin> to be selected in 111ms (' + expect.assertion.elapsedTime + 'ms)');
    });
  });
});
