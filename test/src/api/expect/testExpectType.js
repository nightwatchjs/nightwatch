const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');

describe('expect.type', function() {
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

  it('to be [PASSED]', function() {
    Nocks.elementFound().name('input');
    let expect = this.client.api.expect.element('#weblogin').to.be.an('input');

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.article, 'an');
      assert.equal(expect.assertion.resultValue, 'input');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be an input'));
      assert.equal(expect.assertion.messageParts.length, 1);
    });
  });

  it('to be [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks
      .elementFound()
      .name('div')
      .name('div')
      .name('div');

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input');

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'be an input');
      assert.equal(expect.assertion.actual, 'div');
      assert.equal(expect.assertion.article, 'an');
      assert.equal(expect.assertion.resultValue, 'div');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be an input'));
      assert.equal(expect.assertion.messageParts.length, 0);
    });
  });

  it('to not be [PASSED]', function() {
    Nocks.elementFound().name('input');

    let expect = this.client.api.expect.element('#weblogin').to.not.be.a('div');

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.article, 'a');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.expected, 'not be a div');
      assert.equal(expect.assertion.actual, 'input');
      assert.equal(expect.assertion.resultValue, 'input');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be a div'));
      assert.equal(expect.assertion.messageParts.length, 1);
    });
  });

  it('to not be - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks
      .elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input');

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.resultValue, null);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be an input - element was not found'));
      assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
    });
  });

  it('to be with message [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .name('input')
      .name('input')
      .name('input');

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input', 'weblogin should be an input');

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.article, 'an');
      assert.equal(expect.assertion.resultValue, 'input');
      assert.ok(expect.assertion.message.startsWith('weblogin should be an input'));
      assert.equal(expect.assertion.messageParts.length, 1);
    });
  });

  it('to be with message [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .name('div')
      .name('div')
      .name('div');

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input', 'weblogin should be an input');

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'be an input');
      assert.equal(expect.assertion.actual, 'div');
      assert.equal(expect.assertion.article, 'an');
      assert.equal(expect.assertion.resultValue, 'div');
      assert.equal(expect.assertion.message, 'weblogin should be an input');
      assert.equal(expect.assertion.messageParts.length, 0);
    });
  });

  it('to be with message - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks
      .elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input', 'weblogin should be an input');

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.resultValue, null);
      assert.equal(expect.assertion.message, 'weblogin should be an input - element was not found');
      assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
    });
  });

  it('to be with waitFor - element not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input').before(60);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be an input in 60ms - element was not found'));
    });
  });

  it('to be with waitFor - element found on retry', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementFound().name('input');

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input').before(60);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be an input in 60ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });
  });
});
