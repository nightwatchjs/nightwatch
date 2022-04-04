const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const {strictEqual} = assert;

describe('expect.title', function() {
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

  it('to contain [PASSED]', function() {
    Nocks.title('hp vasq');
    let expect = this.client.api.expect.title().to.contain('hp vasq');

    return this.client.start(function() {
      strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected page title to contain: "hp vasq"'));
    });
  });

  it('toEqual [PASSED]', function() {
    Nocks.title('hp vasq');
    let api = this.client.api.expect.title().to.toEqual('hp vasq');

    return this.client.start(function(err) {
      assert.ok('capabilities' in api);
      assert.strictEqual(err, undefined);
    });
  });

  it('toEqual [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 10;
    this.client.api.globals.waitForConditionPollInterval = 9;
    this.client.api.globals.abortOnAssertionFailure = true;

    Nocks.title('hp vasq').title('hp vasq').title('hp vasq').title('hp vasq');
    
    let api = this.client.api.expect.title().to.toEqual('vasq');

    return this.client.start(function(err) {
      assert.ok('capabilities' in api);
      assert.ok(err instanceof Error);
      assert.ok(/^Expected page title to equal: "vasq" - expected "equal 'vasq'" but got: "hp vasq" \(\d+ms\)$/.test(err.message), err.message);
    });
  });

  it('contains [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.title('hp vasq');

    let expect = this.client.api.expect.title().contains('hp vasq');

    return this.client.start(function() {
      strictEqual(expect.assertion.waitForMs, 40);
      strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected page title to contain: "hp vasq"'));
    });
  });

  it('to equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.title('hp vasq').title('hp vasq');

    let expect = this.client.api.expect.title().to.equal('vasq');

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'equal \'vasq\'');
      strictEqual(expect.assertion.negate, false);
      strictEqual(expect.assertion.actual, 'hp vasq');
      strictEqual(expect.assertion.resultValue, 'hp vasq');
      strictEqual(expect.assertion.passed, false);
      strictEqual(expect.assertion.messageParts[0], ' equal: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected page title to equal: "vasq"'));
    });
  });

  it('to  NOT equal to [PASSED]', function() {
    Nocks.title('hp vasq');

    let expect = this.client.api.expect.title().to.not.equal('xx');

    return this.client.start(function() {
      strictEqual(expect.assertion.negate, true);
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.resultValue, 'hp vasq');
      strictEqual(expect.assertion.messageParts[0], ' not equal: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected page title to not equal: "xx"'));
    });
  });

  it('to  NOT equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks
      .title('hp vasq')
      .title('hp vasq');

    let expect = this.client.api.expect.title().to.not.equal('hp vasq');

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'not equal \'hp vasq\'');
      strictEqual(expect.assertion.negate, true);
      strictEqual(expect.assertion.actual, 'hp vasq');
      strictEqual(expect.assertion.resultValue, 'hp vasq');
      strictEqual(expect.assertion.passed, false);
      strictEqual(expect.assertion.messageParts[0], ' not equal: "hp vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected page title to not equal: "hp vasq"'));
    });
  });

  it('to equal waitFor [PASSED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.title('');

    let expect = this.client.api.expect.title().to.equal('hp vasq').before(40);
    Nocks.title('hp vasq');

    return this.client.start(function() {
      strictEqual(expect.assertion.waitForMs, 40);
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.retries, 1);
      strictEqual(expect.assertion.message, 'Expected page title to equal: "hp vasq" in 40ms (' + expect.assertion.elapsedTime + 'ms)');
    });
  });

  it('to equal and waitFor [FAILED] - value not equal', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks
      .title('xx')
      .title('xx');

    let expect = this.client.api.expect.title().to.equal('hp vasq').before(40);

    return this.client.start(function() {
      strictEqual(expect.assertion.waitForMs, 40);
      strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries >= 1);
      assert.ok(expect.assertion.elapsedTime >= 40);
      strictEqual(expect.assertion.expected, 'equal \'hp vasq\'');
      strictEqual(expect.assertion.actual, 'xx');
      assert.ok(expect.assertion.message.startsWith('Expected page title to equal: "hp vasq" in 40ms'));
    });
  });

  it('to not equal to [PASSED]', function() {
    Nocks.title('xx');

    let expect = this.client.api.expect.title().to.not.equal('vasq');
    assert.ok(expect.assertion.message.startsWith('Expected page title to'));

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'not equal \'vasq\'');
      strictEqual(expect.assertion.actual, 'xx');
      strictEqual(expect.assertion.negate, true);
      strictEqual(expect.assertion.resultValue, 'xx');
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.messageParts[0], ' not equal: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected page title to not equal: "vasq"'));
    });
  });

  it('to not equal to [FAILED]', function() {

    // No need to retry
    this.client.api.globals.waitForConditionTimeout = 0;
    
    Nocks.title('xx');

    let expect = this.client.api.expect.title().to.not.equal('xx');
    assert.ok(expect.assertion.message.startsWith('Expected page title to'));

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'not equal \'xx\'');
      strictEqual(expect.assertion.actual, 'xx');
      strictEqual(expect.assertion.negate, true);
      strictEqual(expect.assertion.resultValue, 'xx');
      strictEqual(expect.assertion.passed, false);
      assert.deepStrictEqual(expect.assertion.messageParts[0], ' not equal: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected page title to not equal: "xx"'));
    });
  });

});
