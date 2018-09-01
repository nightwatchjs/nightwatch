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

  it('to be enabled [PASSED]', function(done) {
    Nocks.elementFound().enabled();
    let expect = this.client.api.expect.element('#weblogin').to.be.enabled;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.resultValue, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be enabled'));
      assert.equal(expect.assertion.messageParts.length, 1);
    });

    this.client.start(done);
  });

  it('to be enabled with waitFor [PASSED]', function(done) {
    Nocks.elementFound().enabled();

    let expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(100);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 100);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be enabled in 100ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });

    this.client.start(done);
  });

  it('to be enabled with waitFor [FAILED]', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().notEnabled(3);

    let expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(60);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be enabled in 60ms'));
    });

    this.client.start(done);
  });

  it('to be enabled [FAILED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .notEnabled()
      .notEnabled()
      .notEnabled();

    let expect = this.client.api.expect.element('#weblogin').to.be.enabled;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'enabled');
      assert.equal(expect.assertion.actual, 'not enabled');
      assert.equal(expect.assertion.resultValue, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be enabled'));
      assert.equal(expect.assertion.messageParts.length, 0);
    });

    this.client.start(done);
  });

  it('to not be enabled [PASSED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .notEnabled()
      .notEnabled()
      .notEnabled();

    let expect = this.client.api.expect.element('#weblogin').to.not.be.enabled;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.expected, 'not enabled');
      assert.equal(expect.assertion.actual, 'not enabled');
      assert.equal(expect.assertion.resultValue, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be enabled'));
      assert.equal(expect.assertion.messageParts.length, 1);
    });

    this.client.start(done);
  });

  it('to not be enabled [FAILED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .enabled()
      .enabled()
      .enabled();

    let expect = this.client.api.expect.element('#weblogin').to.not.be.enabled;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'not enabled');
      assert.equal(expect.assertion.actual, 'enabled');
      assert.equal(expect.assertion.resultValue, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be enabled'));
      assert.equal(expect.assertion.messageParts.length, 0);
    });

    this.client.start(done);
  });

  it('to be enabled - element not found', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.enabled;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'enabled');
      assert.equal(expect.assertion.actual, 'not found');
      assert.equal(expect.assertion.resultValue, null);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be enabled - element was not found'));
      assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
    });

    this.client.start(done);
  });

  it('to not be enabled with waitFor [FAILED]', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().enabled(4);

    let expect = this.client.api.expect.element('#weblogin').to.not.be.enabled.before(120);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 120);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be enabled in 120ms'));
    });

    this.client.start(done);
  });

  it('to be enabled with waitFor - element not found', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(60);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be enabled in 60ms - element was not found'));
    });

    this.client.start(done);
  });

  it('to be enabled with waitFor - element found on retry', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementFound().enabled();

    let expect = this.client.api.expect.element('#weblogin').to.be.enabled.before(60);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be enabled in 60ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });

    this.client.start(done);
  });
});
