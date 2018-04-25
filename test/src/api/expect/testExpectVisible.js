const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');

describe('expect.visible', function() {
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

  it('to be visible [PASSED]', function(done) {
    Nocks.elementFound().visible();
    let expect = this.client.api.expect.element('#weblogin').to.be.visible;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.resultValue, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be visible'));
      assert.equal(expect.assertion.messageParts.length, 1);
    });

    this.client.start(done);
  });

  it('to be visible with waitFor [PASSED]', function(done) {
    Nocks.elementFound().visible();

    let expect = this.client.api.expect.element('#weblogin').to.be.visible.before(100);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 100);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be visible in 100ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });

    this.client.start(done);
  });

  it('to be visible with waitFor [FAILED]', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().notVisible(3);

    let expect = this.client.api.expect.element('#weblogin').to.be.visible.before(60);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be visible in 60ms'));
    });

    this.client.start(done);
  });

  it('to be visible [FAILED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .notVisible()
      .notVisible()
      .notVisible();

    let expect = this.client.api.expect.element('#weblogin').to.be.visible;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'visible');
      assert.equal(expect.assertion.actual, 'not visible');
      assert.equal(expect.assertion.resultValue, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be visible'));
      assert.equal(expect.assertion.messageParts.length, 0);
    });

    this.client.start(done);
  });

  it('to not be visible [PASSED]', function(done) {
    Nocks.elementFound().notVisible();

    let expect = this.client.api.expect.element('#weblogin').to.not.be.visible;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.expected, 'not visible');
      assert.equal(expect.assertion.actual, 'not visible');
      assert.equal(expect.assertion.resultValue, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be visible'));
      assert.equal(expect.assertion.messageParts.length, 1);
    });

    this.client.start(done);
  });

  it('to not be visible [FAILED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .visible()
      .visible()
      .visible();

    let expect = this.client.api.expect.element('#weblogin').to.not.be.visible;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'not visible');
      assert.equal(expect.assertion.actual, 'visible');
      assert.equal(expect.assertion.resultValue, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be visible'));
      assert.equal(expect.assertion.messageParts.length, 0);
    });

    this.client.start(done);
  });

  it('to be visible - element not found', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks
      .elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.visible;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'visible');
      assert.equal(expect.assertion.actual, 'not found');
      assert.equal(expect.assertion.resultValue, null);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be visible - element was not found'));
      assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
    });

    this.client.start(done);
  });

  it('to not be visible with waitFor [FAILED]', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 15;

    Nocks.elementFound().visible().visible();

    let expect = this.client.api.expect.element('#weblogin').to.not.be.visible.before(25);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 25);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be visible in 25ms'));
      assert.equal(expect.assertion.passed, false);
    });

    this.client.start(done);
  });

  it('to not be visible with waitFor [PASSED] - element not visible on retry', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 10;

    Nocks.elementFound().visible().notVisible().notVisible();

    let expect = this.client.api.expect.element('#weblogin').to.not.be.visible.before(30);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 30);
      assert.equal(expect.assertion.message.indexOf('Expected element <#weblogin> to not be visible in 30ms'), 0);
      assert.equal(expect.assertion.passed, true, 'Assertion has passed');
    });

    this.client.start(done);
  });

  it('to be visible with waitFor - element not found', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.visible.before(60);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be visible in 60ms - element was not found'));
    });

    this.client.start(done);
  });

  it('to be visible with waitFor - element found on retry', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementFound().visible();

    let expect = this.client.api.expect.element('#weblogin').to.be.visible.before(60);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be visible in 60ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });

    this.client.start(done);
  });
});