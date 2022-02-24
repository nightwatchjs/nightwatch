const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const {strictEqual} = assert;

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

    const expect = this.client.api.expect.element('#weblogin').to.be.an('input');

    return this.client.start(function(err) {
      if (err) {
        return Promise.reject(err);
      }
      strictEqual(expect.assertion.selector, '#weblogin');
      strictEqual(expect.assertion.negate, false);
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.article, 'an');
      strictEqual(expect.assertion.resultValue, 'input');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be an input'));
      strictEqual(expect.assertion.messageParts.length, 1);
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
      strictEqual(expect.assertion.selector, '#weblogin');
      strictEqual(expect.assertion.negate, false);
      strictEqual(expect.assertion.waitForMs, 40);
      strictEqual(expect.assertion.passed, false);
      strictEqual(expect.assertion.expected, 'be an input');
      strictEqual(expect.assertion.actual, 'div');
      strictEqual(expect.assertion.article, 'an');
      strictEqual(expect.assertion.resultValue, 'div');
      strictEqual(expect.assertion.message, `Expected element <#weblogin> to be an input - expected "be an input" but got: "div" (${expect.assertion.elapsedTime}ms)`);
      strictEqual(expect.assertion.messageParts.length, 2);
    });
  });

  it('to not be [PASSED]', function() {
    Nocks.elementFound().name('input');

    let expect = this.client.api.expect.element('#weblogin').to.not.be.a('div');

    return this.client.start(function() {
      strictEqual(expect.assertion.selector, '#weblogin');
      strictEqual(expect.assertion.article, 'a');
      strictEqual(expect.assertion.negate, true);
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.expected, 'not be a div');
      strictEqual(expect.assertion.actual, 'input');
      strictEqual(expect.assertion.resultValue, 'input');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not be a div'));
      strictEqual(expect.assertion.messageParts.length, 1);
    });
  });

  it('to not be [PASSED] with upper case', function() {
    Nocks.elementFound().name('INPUT');
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;
    let expect = this.client.api.expect.element('#weblogin').to.be.an('input');

    return this.client.start(function() {
      strictEqual(expect.assertion.passed, true);
    });
  });

  it('to not be [FAILED] with upper case', function() {
    Nocks.elementFound().name('INPUT');
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;
    let expect = this.client.api.expect.element('#weblogin').to.not.be.an('input');

    return this.client.start(function() {
      strictEqual(expect.assertion.passed, false);
    });
  });

  it('to not be [PASSED] with regex', function() {
    Nocks.elementFound().name('INPUT');
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;
    let expect = this.client.api.expect.element('#weblogin').to.be.an(/^input/i);

    return this.client.start(function() {
      strictEqual(expect.assertion.passed, true);
    });
  });

  it('to not be [FAILED] with regex', function() {
    Nocks.elementFound().name('INPUT');
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;
    let expect = this.client.api.expect.element('#weblogin').to.not.be.an(/^input/i);

    return this.client.start(function() {
      strictEqual(expect.assertion.passed, false);
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
      strictEqual(expect.assertion.selector, '#weblogin');
      strictEqual(expect.assertion.negate, false);
      strictEqual(expect.assertion.waitForMs, 40);
      strictEqual(expect.assertion.passed, false);
      strictEqual(expect.assertion.expected, 'present');
      strictEqual(expect.assertion.actual, 'not present');
      strictEqual(expect.assertion.resultValue, null);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be an input - element was not found'));
      assert.ok(expect.assertion.messageParts.includes(' - element was not found'));
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
      strictEqual(expect.assertion.selector, '#weblogin');
      strictEqual(expect.assertion.negate, false);
      strictEqual(expect.assertion.waitForMs, 40);
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.article, 'an');
      strictEqual(expect.assertion.resultValue, 'input');
      strictEqual(expect.assertion.message, `weblogin should be an input (${expect.assertion.elapsedTime}ms)`);
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
      strictEqual(expect.assertion.selector, '#weblogin');
      strictEqual(expect.assertion.negate, false);
      strictEqual(expect.assertion.waitForMs, 40);
      strictEqual(expect.assertion.passed, false);
      strictEqual(expect.assertion.expected, 'be an input');
      strictEqual(expect.assertion.actual, 'div');
      strictEqual(expect.assertion.article, 'an');
      strictEqual(expect.assertion.resultValue, 'div');
      strictEqual(expect.assertion.message, `weblogin should be an input - expected "be an input" but got: "div" (${expect.assertion.elapsedTime}ms)`);
      strictEqual(expect.assertion.messageParts.length, 0);
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
      strictEqual(expect.assertion.selector, '#weblogin');
      strictEqual(expect.assertion.negate, false);
      strictEqual(expect.assertion.waitForMs, 40);
      strictEqual(expect.assertion.passed, false);
      strictEqual(expect.assertion.expected, 'present');
      strictEqual(expect.assertion.actual, 'not present');
      strictEqual(expect.assertion.resultValue, null);
      strictEqual(expect.assertion.message, `weblogin should be an input - element was not found - expected "present" but got: "not present" (${expect.assertion.elapsedTime}ms)`);
    });
  });

  it('to be with waitFor - element not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input').before(60);

    return this.client.start(function() {
      strictEqual(expect.assertion.waitForMs, 60);
      strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to be an input in 60ms - element was not found'));
    });
  });

  it('to be with waitFor - element found on retry', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementFound().name('input');

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input').before(60);

    return this.client.start(function() {
      strictEqual(expect.assertion.waitForMs, 60);
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.message, 'Expected element <#weblogin> to be an input in 60ms (' + expect.assertion.elapsedTime + 'ms)');
    });
  });
});
