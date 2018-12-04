const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');

describe('expect.url', function() {
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
    Nocks.url().getUrl();
    let expect = this.client.api.expect.url().to.contain('localhost');

    return this.client.start(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected current url to contain: "localhost"'), expect.assertion.message);
    });
  });

  it('contains [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.url().getUrl();

    let expect = this.client.api.expect.url().contains('localhost');

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected current url to contain: "localhost"'));
    });
  });

  it('to equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.url().getUrl();

    let expect = this.client.api.expect.url().to.equal('vasq');

    return this.client.start(function() {
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.actual, 'http://localhost');
      assert.equal(expect.assertion.resultValue, 'http://localhost');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' equal: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected current url to equal: "vasq"'));
    });
  });

  it('to NOT equal to [PASSED]', function() {
    Nocks.url().getUrl();

    let expect = this.client.api.expect.url().to.not.equal('xx');

    return this.client.start(function() {
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.resultValue, 'http://localhost');
      assert.equal(expect.assertion.messageParts[0], ' not equal: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected current url to not equal: "xx"'));
    });
  });

  it('to NOT equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.url().getUrl();

    let expect = this.client.api.expect.url().to.not.equal('http://localhost');

    return this.client.start(function() {
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.actual, 'http://localhost');
      assert.equal(expect.assertion.resultValue, 'http://localhost');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' not equal: "http://localhost"');
      assert.ok(expect.assertion.message.startsWith('Expected current url to not equal: "http://localhost"'));
    });
  });

  it('to not equal to [PASSED]', function() {
    Nocks.url().getUrl();

    let expect = this.client.api.expect.url().to.not.equal('vasq');
    assert.ok(expect.assertion.message.startsWith('Expected current url to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not equal \'vasq\'');
      assert.equal(expect.assertion.actual, 'http://localhost');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'http://localhost');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not equal: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected current url to not equal: "vasq"'));
    });
  });

  it('to not equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.url().getUrl();

    let expect = this.client.api.expect.url().to.not.equal('http://localhost');
    assert.ok(expect.assertion.message.startsWith('Expected current url to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not equal \'http://localhost\'');
      assert.equal(expect.assertion.actual, 'http://localhost');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'http://localhost');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts[0], ' not equal: "http://localhost"');
      assert.ok(expect.assertion.message.startsWith('Expected current url to not equal: "http://localhost"'));
    });
  });

  it('to not contains [PASSED]', function() {
    Nocks.url().getUrl();

    let expect = this.client.api.expect.url().to.not.contains('vasq');

    assert.ok(expect.assertion.message.startsWith('Expected current url to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not contain \'vasq\'');
      assert.equal(expect.assertion.actual, 'http://localhost');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'http://localhost');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not contain: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected current url to not contain: "vasq"'));
    });
  });



  it('to not contain [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.url().getUrl();

    let expect = this.client.api.expect.url().to.not.contains('http://localhost');
    assert.ok(expect.assertion.message.startsWith('Expected current url to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not contain \'http://localhost\'');
      assert.equal(expect.assertion.actual, 'http://localhost');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'http://localhost');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts[0], ' not contain: "http://localhost"');
      assert.ok(expect.assertion.message.startsWith('Expected current url to not contain: "http://localhost"'));
    });
  });

  it('to not match [PASSED]', function() {
    Nocks.url().getUrl();

    let expect = this.client.api.expect.url().to.not.match(/vasq/);

    assert.ok(expect.assertion.message.startsWith('Expected current url to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not match \'/vasq/\'');
      assert.equal(expect.assertion.actual, 'http://localhost');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'http://localhost');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not match: "/vasq/"');
      assert.ok(expect.assertion.message.startsWith('Expected current url to not match: "/vasq/"'));
    });
  });

  it('to not match [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.url().getUrl();

    let expect = this.client.api.expect.url().to.not.match(/localhost/);
    assert.ok(expect.assertion.message.startsWith('Expected current url to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not match \'/localhost/\'');
      assert.equal(expect.assertion.actual, 'http://localhost');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'http://localhost');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts[0], ' not match: "/localhost/"');
      assert.ok(expect.assertion.message.startsWith('Expected current url to not match: "/localhost/"'));
    });
  });



  it('to  match - throws exception on invalid regex', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.url().getUrl();

    let expect = this.client.api.expect.url();
    assert.throws(function() {
      expect.matches('');
    }.bind(this));

    return this.client.start();
  });


});
