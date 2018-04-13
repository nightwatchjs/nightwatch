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

  it('to be selected [PASSED]', function(done) {
    Nocks.elementFound().selected();
    let expect = this.client.api.expect.element('#weblogin').to.be.selected;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.resultValue, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be selected'));
      assert.equal(expect.assertion.messageParts.length, 1);
    });

    this.client.start(done);
  });

  it('to be selected with waitFor [PASSED]', function(done) {
    Nocks.elementFound().selected();

    let expect = this.client.api.expect.element('#weblogin').to.be.selected.before(100);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 100);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be selected in 100ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });

    this.client.start(done);
  });

  it('to be selected with waitFor [FAILED]', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().notSelected(3);

    let expect = this.client.api.expect.element('#weblogin').to.be.selected.before(60);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be selected in 60ms'));
    });

    this.client.start(done);
  });

  it('to be selected [FAILED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .notSelected()
      .notSelected()
      .notSelected();

    let expect = this.client.api.expect.element('#weblogin').to.be.selected;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'selected');
      assert.equal(expect.assertion.actual, 'not selected');
      assert.equal(expect.assertion.resultValue, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be selected'));
      assert.equal(expect.assertion.messageParts.length, 0);
    });

    this.client.start(done);
  });

  it('to not be selected [PASSED]', function(done) {
    Nocks.elementFound().notSelected();

    let expect = this.client.api.expect.element('#weblogin').to.not.be.selected;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.expected, 'not selected');
      assert.equal(expect.assertion.actual, 'not selected');
      assert.equal(expect.assertion.resultValue, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be selected'));
      assert.equal(expect.assertion.messageParts.length, 1);
    });

    this.client.start(done);
  });

  it('to not be selected [FAILED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .selected()
      .selected()
      .selected();

    let expect = this.client.api.expect.element('#weblogin').to.not.be.selected;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'not selected');
      assert.equal(expect.assertion.actual, 'selected');
      assert.equal(expect.assertion.resultValue, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be selected'));
      assert.equal(expect.assertion.messageParts.length, 0);
    });

    this.client.start(done);
  });

  it('to be selected - element not found', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.selected;
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'selected');
      assert.equal(expect.assertion.actual, 'not found');
      assert.equal(expect.assertion.resultValue, null);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be selected - element was not found'));
      assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
    });

    this.client.start(done);
  });

  it('to not be selected with waitFor [FAILED]', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().selected(3);

    let expect = this.client.api.expect.element('#weblogin').to.not.be.selected.before(120);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 120);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be selected in 120ms'));
    });

    this.client.start(done);
  });

  it('to be selected with waitFor - element not found', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.selected.before(60);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be selected in 60ms - element was not found'));
    });

    this.client.start(done);
  });

  it('to be selected with waitFor - element found on retry', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementFound().selected();

    let expect = this.client.api.expect.element('#weblogin').to.be.selected.before(60);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be selected in 60ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });

    this.client.start(done);
  });
});
