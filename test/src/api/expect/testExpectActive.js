const assert = require('assert');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const Nocks = require('../../../lib/nocks.js');

describe('expect.active', function() {
  beforeEach(function(done) {
    ExpectGlobals.beforeEach.call(this, {
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

  it('to be active [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound().active();

    let expect = this.client.api.expect.element('#weblogin').to.be.active;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.waitForMs, 40);
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(/^Expected element <#weblogin> to be active \(\d+ms\)$/.test(expect.assertion.message), expect.assertion.message);
      assert.strictEqual(expect.assertion.messageParts.length, 1, expect.assertion.messageParts);
    });
  });

  it('to be active with waitFor [PASSED]', function() {
    Nocks.elementFound().active();

    let expect = this.client.api.expect.element('#weblogin').to.be.active.before(100);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 100);
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be active in 100ms'), expect.assertion.message);
    });
  });

  it('to be active with waitFor [FAILED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound()
      .notActive()
      .notActive()
      .notActive();

    let expect = this.client.api.expect.element('#weblogin').to.be.active.before(60);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 60);
      assert.strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be active in 60ms'), expect.assertion.message);
    });
  });

  it('to be active [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .notActive()
      .notActive()
      .notActive();

    const expect = this.client.api.expect.element('#weblogin').to.be.active;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.waitForMs, 40);
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.expected, 'active');
      assert.strictEqual(expect.assertion.actual, 'not active');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be active'));
    });
  });

  it('to be active with waitFor [PASSED on retry]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementNotFound().elementFound().active();

    const expect = this.client.api.expect.element('#weblogin').to.be.active.before(60);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 60);
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be active in 60ms'));
    });
  });

  it('to not be active [PASSED]', function() {
    Nocks.elementFound().notActive();

    const expect = this.client.api.expect.element('#weblogin').to.not.be.active;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, true);
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.expected, 'not active');
      assert.strictEqual(expect.assertion.actual, 'not active');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be active'));
      assert.strictEqual(expect.assertion.messageParts.length, 1);
    });
  });

  it('to not be active [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks
      .elementFound()
      .elementFound()
      .elementFound()
      .active()
      .active()
      .active();

    const expect = this.client.api.expect.element('#weblogin').to.not.be.active;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, true);
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.expected, 'not active');
      assert.strictEqual(expect.assertion.actual, 'active');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be active'));
    });
  });

  it('to be active - xpath via useXpath [PASSED]', function() {
    Nocks.elementFoundXpath().active();

    this.client.api.useXpath();
    let expect = this.client.api.expect.element('//weblogin').to.be.active;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '//weblogin');
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <//weblogin> to be active'));
    });
  });

  it('to be active - xpath via argument [PASSED]', function() {
    Nocks.elementFoundXpath().active();

    let expect = this.client.api.expect.element('//weblogin', 'xpath').to.be.active;

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '//weblogin');
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <//weblogin> to be active'));
    });
  });
});
