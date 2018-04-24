const assert = require('assert');
const Nocks = require('../../../lib/Nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');

describe('expect.type', function() {
  beforeEach(function(done) {
    ExpectGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    ExpectGlobals.afterEach.call(this, done);
  });

  it('to be [PASSED]', function(done) {
    Nocks.elementFound().name('input');
    let expect = this.client.api.expect.element('#weblogin').to.be.an('input');
    this.client.once('nightwatch:finished', function(results, errors) {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, null);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.article, 'an');
      assert.equal(expect.assertion.resultValue, 'input');
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be an input');
      assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
      assert.deepEqual(expect.assertion.messageParts, []);
      assert.equal(results.passed, 1);
      assert.equal(results.failed, 0);
      assert.equal(results.tests[0].message, 'Expected element <#weblogin> to be an input');
    });

    this.client.start(done);
  });

  it('to be [FAILED]', function(done) {
    Nocks.elementFound().name('input');

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input');
    this.client.once('nightwatch:finished', function(results, errors) {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, null);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'be an input');
      assert.equal(expect.assertion.actual, null);
      assert.equal(expect.assertion.article, 'an');
      assert.equal(expect.assertion.resultValue, null);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be an input');
      assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
      assert.deepEqual(expect.assertion.messageParts, []);
      assert.equal(results.passed, 0);
      assert.equal(results.failed, 1);
      assert.equal(results.tests[0].message, 'Expected element <#weblogin> to be an input');
    });

    this.client.start(done);
  });

  it('to not be [PASSED]', function(done) {
    Nocks.elementFound().name('input');

    let expect = this.client.api.expect.element('#weblogin').to.not.be.a('div');
    this.client.once('nightwatch:finished', function(results, errors) {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.article, 'a');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.expected, 'not be a div');
      assert.equal(expect.assertion.actual, 'input');
      assert.equal(expect.assertion.resultValue, 'input');
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not be a div');
      assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
      assert.deepEqual(expect.assertion.messageParts, []);
      assert.equal(results.passed, 1);
      assert.equal(results.failed, 0);
      assert.equal(results.tests[0].message, 'Expected element <#weblogin> to not be a div');
    });

    this.client.start(done);
  });

  it('to be [FAILED]', function(done) {
    Nocks.elementFound().name('div');

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input');
    this.client.once('nightwatch:finished', function(results, errors) {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'be an input');
      assert.equal(expect.assertion.actual, 'div');
      assert.equal(expect.assertion.resultValue, 'div');
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be an input');
      assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
      assert.deepEqual(expect.assertion.messageParts, []);
      assert.equal(results.passed, 0);
      assert.equal(results.failed, 1);
      assert.equal(results.tests[0].message, 'Expected element <#weblogin> to be an input');
    });

    this.client.start(done);
  });

  it('to not be - element not found', function(done) {
    Nocks.elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input');
    this.client.once('nightwatch:finished', function(results, errors) {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, null);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.resultValue, null);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be an input - element was not found');
      assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
      assert.equal(results.passed, 0);
      assert.equal(results.failed, 1);
      assert.equal(results.tests[0].message, 'Expected element <#weblogin> to be an input - element was not found');
    });

    this.client.start(done);
  });

  it('to not be - element not found', function(done) {
    Nocks.elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input');
    this.client.once('nightwatch:finished', function(results, errors) {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, null);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.resultValue, null);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be an input - element was not found');
      assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
      assert.equal(results.passed, 0);
      assert.equal(results.failed, 1);
      assert.equal(results.tests[0].message, 'Expected element <#weblogin> to be an input - element was not found');
    });

    this.client.start(done);
  });

  it('to be with message [PASSED]', function(done) {
    Nocks.elementFound().name('input');

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input', 'weblogin should be an input');
    this.client.once('nightwatch:finished', function(results, errors) {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, null);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.article, 'an');
      assert.equal(expect.assertion.resultValue, 'input');
      assert.equal(expect.assertion.message, 'weblogin should be an input');
      assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
      assert.deepEqual(expect.assertion.messageParts, []);
      assert.equal(results.passed, 1);
      assert.equal(results.failed, 0);
      assert.equal(results.tests[0].message, 'weblogin should be an input');
    });

    this.client.start(done);
  });

  it('to be with message [FAILED]', function(done) {
    Nocks.elementFound().name('div');

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input', 'weblogin should be an input');
    this.client.once('nightwatch:finished', function(results, errors) {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, null);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'be an input');
      assert.equal(expect.assertion.actual, 'div');
      assert.equal(expect.assertion.article, 'an');
      assert.equal(expect.assertion.resultValue, 'div');
      assert.equal(expect.assertion.message, 'weblogin should be an input');
      assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
      assert.deepEqual(expect.assertion.messageParts, []);
      assert.equal(results.passed, 0);
      assert.equal(results.failed, 1);
      assert.equal(results.tests[0].message, 'weblogin should be an input');
    });

    this.client.start(done);
  });

  it('to be with message - element not found', function(done) {
    Nocks.elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input', 'weblogin should be an input');
    this.client.once('nightwatch:finished', function(results, errors) {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, null);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.resultValue, null);
      assert.equal(expect.assertion.message, 'weblogin should be an input - element was not found');
      assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
      assert.equal(results.passed, 0);
      assert.equal(results.failed, 1);
      assert.equal(results.tests[0].message, 'weblogin should be an input - element was not found');
    });

    this.client.start(done);
  });

  it('to be with waitFor - element not found', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input').before(60);
    this.client.once('nightwatch:finished', function(results, errors) {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be an input in 60ms - element was not found');
    });

    this.client.start(done);
  });

  it('to be with waitFor - element found on retry', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementFound().name('input');

    let expect = this.client.api.expect.element('#weblogin').to.be.an('input').before(60);
    this.client.once('nightwatch:finished', function(results, errors) {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to be an input in 60ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
    });

    this.client.start(done);
  });
});
