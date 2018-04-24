const assert = require('assert');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const Nocks = require('../../../lib/nocks.js');

describe('expect.present', function() {
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

  it('to be present [PASSED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .elementFound()
      .elementFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.present;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be present'));
      assert.equal(expect.assertion.messageParts.length, 1);
    });

    this.client.start(done);
  });

  it('to be present with waitFor [PASSED]', function(done) {
    Nocks.elementFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.present.before(100);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 100);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be present in 100ms - element was present in ' + expect.assertion.elapsedTime + 'ms'));
    });

    this.client.start(done);
  });

  it('to be present with waitFor [FAILED]', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.present.before(60);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be present in 60ms - element was not found'));
    });

    this.client.start(done);
  });

  it('to be present [FAILED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.present;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be present - element was not found'));
      assert.equal(expect.assertion.messageParts[0], ' - element was not found');
    });

    this.client.start(done);
  });

  it('to be present with waitFor [PASSED on retry]', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementNotFound().elementFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.present.before(60);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be present in 60ms - element was present in ' + expect.assertion.elapsedTime + 'ms'));
    });

    this.client.start(done);
  });

  it('to not be present [FAILED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .elementFound()
      .elementFound();

    let expect = this.client.api.expect.element('#weblogin').to.not.be.present;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'not present');
      assert.equal(expect.assertion.actual, 'present');
      assert.equal(typeof expect.assertion.resultValue, 'undefined');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be present'));
      assert.equal(expect.assertion.messageParts.length, 1);
    });

    this.client.start(done);
  });

  it('to be present - xpath via useXpath [PASSED]', function(done) {
    Nocks.elementFoundXpath();

    this.client.api.useXpath();
    let expect = this.client.api.expect.element('//weblogin').to.be.present;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '//weblogin');
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <//weblogin> to be present'));
    });

    this.client.start(done);
  });

  it('to be present - xpath via argument [PASSED]', function(done) {
    Nocks.elementFoundXpath();

    let expect = this.client.api.expect.element('//weblogin', 'xpath').to.be.present;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '//weblogin');
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <//weblogin> to be present'));
    });

    this.client.start(done);
  });
});
