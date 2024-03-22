const assert = require('assert');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const Nocks = require('../../../lib/nocks.js');

describe('expect.enabled', function() {
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

  it('to be enabled [PASSED]', function() {
    Nocks.elementFound().enabled();
    let expect = this.client.api.expect.element('#weblogin').to.be.enabled;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.resultValue, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be enabled'));
      assert.strictEqual(expect.assertion.messageParts.length, 1);
    });
  });

  it('to be enabled with waitFor [PASSED]', function() {
    Nocks.elementFound().enabled();

    let expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(100);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 100);
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be enabled in 100ms (' + expect.assertion.elapsedTime + 'ms)'));
    });
  });

  it('to be enabled with waitFor [FAILED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().notEnabled(3);

    let expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(60);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 60);
      assert.strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be enabled in 60ms'), expect.assertion.message);
    });
  });

  it('to be enabled [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .notEnabled()
      .notEnabled()
      .notEnabled();

    let expect = this.client.api.expect.element('#weblogin').to.be.enabled;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.waitForMs, 40);
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.expected, 'enabled');
      assert.strictEqual(expect.assertion.actual, 'not enabled');
      assert.strictEqual(expect.assertion.resultValue, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be enabled'));
      assert.strictEqual(expect.assertion.messageParts.length, 2);
    });
  });

  it('to not be enabled [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .notEnabled()
      .notEnabled()
      .notEnabled();

    let expect = this.client.api.expect.element('#weblogin').to.not.be.enabled;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, true);
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.expected, 'not enabled');
      assert.strictEqual(expect.assertion.actual, 'not enabled');
      assert.strictEqual(expect.assertion.resultValue, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be enabled'));
      assert.strictEqual(expect.assertion.messageParts.length, 1);
    });
  });

  it('to not be enabled [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .enabled()
      .enabled()
      .enabled();

    let expect = this.client.api.expect.element('#weblogin').to.not.be.enabled;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, true);
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.expected, 'not enabled');
      assert.strictEqual(expect.assertion.actual, 'enabled');
      assert.strictEqual(expect.assertion.resultValue, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be enabled'));
      assert.strictEqual(expect.assertion.messageParts.length, 2);
    });
  });

  it('to be enabled - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.enabled;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.waitForMs, 40);
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.expected, 'enabled');
      assert.strictEqual(expect.assertion.actual, 'not found');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be enabled - element was not found'));
      assert.ok(expect.assertion.messageParts.includes(' - element was not found'));
    });
  });

  it('to not be enabled with waitFor [FAILED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().enabled(4);

    let expect = this.client.api.expect.element('#weblogin').to.not.be.enabled.before(120);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 120);
      assert.strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be enabled in 120ms'));
    });
  });

  it('to be enabled with waitFor - element not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(60);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 60);
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.expected, 'enabled');
      assert.strictEqual(expect.assertion.actual, 'not found');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be enabled in 60ms - element was not found'));
    });
  });

  it('to be enabled with waitFor - element found on retry', function() {
    this.client.api.globals.waitForConditionPollInterval = 100;

    Nocks.elementNotFound().elementFound().enabled();

    let expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(111);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.waitForMs, 111);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be enabled in 111ms (' + expect.assertion.elapsedTime + 'ms)'));
    });
  });
});
