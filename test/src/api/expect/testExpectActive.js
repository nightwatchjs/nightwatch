const assert = require('assert');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const Nocks = require('../../../lib/nocks.js');

describe('expect.active', function() {
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

  it('to be active [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound().active();

    let expect = this.client.api.expect.element('#weblogin').to.be.active;

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be active'));
      assert.equal(expect.assertion.messageParts.length, 1);
    });
  });

  it('to be active with waitFor [PASSED]', function() {
    Nocks.elementFound().active();

    let expect = this.client.api.expect.element('#weblogin').to.be.active.before(100);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 100);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith(`Expected element <#weblogin> to be active in 100ms - condition was met in ${expect.assertion.elapsedTime}ms`));
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
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be active in 60ms'));
    });
  });

  it('to be active [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .notActive()
      .notActive()
      .notActive();

    let expect = this.client.api.expect.element('#weblogin').to.be.active;

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'active');
      assert.equal(expect.assertion.actual, 'not active');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be active'));
    });
  });

  it('to be active with waitFor [PASSED on retry]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementNotFound().elementFound().active();

    let expect = this.client.api.expect.element('#weblogin').to.be.active.before(60);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be active in 60ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });
  });

  it('to not be active [PASSED]', function() {
    Nocks.elementFound().notActive();

    let expect = this.client.api.expect.element('#weblogin').to.not.be.active;

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.expected, 'not active');
      assert.equal(expect.assertion.actual, 'not active');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be active'));
      assert.equal(expect.assertion.messageParts.length, 1);
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

    let expect = this.client.api.expect.element('#weblogin').to.not.be.active;

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'not active');
      assert.equal(expect.assertion.actual, 'active');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be active'));
    });
  });

  it('to be active - xpath via useXpath [PASSED]', function() {
    Nocks.elementFoundXpath().active();

    this.client.api.useXpath();
    let expect = this.client.api.expect.element('//weblogin').to.be.active;

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '//weblogin');
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <//weblogin> to be active'));
    });
  });

  it('to be active - xpath via argument [PASSED]', function() {
    Nocks.elementFoundXpath().active();

    let expect = this.client.api.expect.element('//weblogin', 'xpath').to.be.active;

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '//weblogin');
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <//weblogin> to be active'));
    });
  });
});
