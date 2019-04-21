const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');

describe('expect.title', function() {
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

  it('to contain [PASSED]', function() {
    Nocks.title('hp vasq');
    let expect = this.client.api.expect.title().to.contain('hp vasq');

    return this.client.start(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected page title to contain: "hp vasq"'));
    });
  });

  it('contains [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.title('hp vasq');

    let expect = this.client.api.expect.title().contains('hp vasq');

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected page title to contain: "hp vasq"'));
    });
  });

  it('to equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.title('hp vasq').title('hp vasq');

    let expect = this.client.api.expect.title().to.equal('vasq');

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'equal \'vasq\'');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.actual, 'hp vasq');
      assert.equal(expect.assertion.resultValue, 'hp vasq');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' equal: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected page title to equal: "vasq"'));
    });
  });

  it('to  NOT equal to [PASSED]', function() {
    Nocks.title('hp vasq');

    let expect = this.client.api.expect.title().to.not.equal('xx');

    return this.client.start(function() {
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.resultValue, 'hp vasq');
      assert.equal(expect.assertion.messageParts[0], ' not equal: "xx"');
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
      assert.equal(expect.assertion.expected, 'not equal \'hp vasq\'');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.actual, 'hp vasq');
      assert.equal(expect.assertion.resultValue, 'hp vasq');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' not equal: "hp vasq"' );
      assert.ok(expect.assertion.message.startsWith('Expected page title to not equal: "hp vasq"'));
    });
  });

  it('to equal waitFor [PASSED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.title('');

    let expect = this.client.api.expect.title().to.equal('hp vasq').before(40);
    Nocks.title('hp vasq');

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.retries, 1);
      assert.ok(expect.assertion.message.startsWith('Expected page title to equal: "hp vasq" in 40ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });
  });

  it('to equal and waitFor [FAILED] - value not equal', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks
      .title('xx')
      .title('xx');

    let expect = this.client.api.expect.title().to.equal('hp vasq').before(40);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries >= 1);
      assert.ok(expect.assertion.elapsedTime >= 40);
      assert.equal(expect.assertion.expected, 'equal \'hp vasq\'');
      //assert.equal(expect.assertion.actual, 'xx');
      assert.ok(expect.assertion.message.startsWith('Expected page title to equal: "hp vasq" in 40ms'));
    });
  });

  it('to not equal to [PASSED]', function() {
    Nocks.title('xx');

    let expect = this.client.api.expect.title().to.not.equal('vasq');
    assert.ok(expect.assertion.message.startsWith('Expected page title to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not equal \'vasq\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not equal: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected page title to not equal: "vasq"'));
    });
  });

  it('to not equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.title('xx');

    let expect = this.client.api.expect.title().to.not.equal('xx');
    assert.ok(expect.assertion.message.startsWith('Expected page title to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts[0], ' not equal: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected page title to not equal: "xx"'));
    });
  });

});
