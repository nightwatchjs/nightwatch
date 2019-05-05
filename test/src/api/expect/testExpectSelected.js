const assert = require('assert');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const Nocks = require('../../../lib/nocks.js');

describe('expect.selected', function() {
  beforeEach(function(done) {
    ExpectGlobals.beforeEach.call(this, () => {
      this.client.api.globals.abortOnAssertionFailure = false;
      done();
    });
  });

  afterEach(function(done) {
    Nocks.cleanAll();
    ExpectGlobals.afterEach.call(this, done);
  });

  it('to be selected [PASSED]', function() {
    Nocks.elementFound().selected();
    let expect = this.client.api.expect.element('#weblogin').to.be.selected;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.resultValue, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be selected'));
      assert.strictEqual(expect.assertion.messageParts.length, 1);
    });
  });

  it('to be selected with waitFor [PASSED]', function() {
    Nocks.elementFound().selected();

    let expect = this.client.api.expect.element('#weblogin').to.be.selected.before(100);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 100);
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be selected in 100ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });
  });

  it('to be selected with waitFor [FAILED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().notSelected(3);

    let expect = this.client.api.expect.element('#weblogin').to.be.selected.before(60);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 60);
      assert.strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be selected in 60ms'));
    });
  });

  it('to be selected [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .notSelected()
      .notSelected()
      .notSelected();

    let expect = this.client.api.expect.element('#weblogin').to.be.selected;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.waitForMs, 40);
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.expected, 'selected');
      assert.strictEqual(expect.assertion.actual, 'not selected');
      assert.strictEqual(expect.assertion.resultValue, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be selected'));
      assert.strictEqual(expect.assertion.messageParts.length, 0);
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
      assert.strictEqual(expect.assertion.messageParts.length, 0);
    });
  });

  it('to be selected - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.selected;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.waitForMs, 40);
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.expected, 'selected');
      assert.strictEqual(expect.assertion.actual, 'not found');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be selected - element was not found'));
      assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
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
    this.client.api.globals.waitForConditionPollInterval = 10;

    Nocks.elementNotFound().elementFound().selected();

    let expect = this.client.api.expect.element('#weblogin').to.be.selected.before(11);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 11);
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be selected in 11ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });
  });
});
