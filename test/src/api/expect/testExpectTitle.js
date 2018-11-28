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

    console.log(expect.assertion.message);

    return this.client.start(function() {

      console.log(expect.assertion.message);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected page title to contain: "hp vasq"'));
    });
  });

  it('contains [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.title('hp vasq');

    let expect = this.client.api.expect.title().contains('hp vasq');

    console.log(expect.assertion.message);

    return this.client.start(function() {

      console.log(expect.assertion.message);

      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected page title to contain: "hp vasq"'));
    });
  });

  it('to equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.title('hp vasq');

    let expect = this.client.api.expect.title().to.equal('vasq');

    console.log(expect.assertion.message);

    return this.client.start(function() {

      console.log(expect.assertion.message);

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
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.title('hp vasq');

    let expect = this.client.api.expect.title().to.not.equal('hp vasq');

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not equal \'hp vasq\'');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.actual, 'hp vasq');
      assert.equal(expect.assertion.resultValue, 'hp vasq');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts, ' not equal: "hp vasq"' );
      assert.ok(expect.assertion.message.startsWith('Expected page title to not equal: "hp vasq"'));
    });
  });

  it('to equal waitFor [PASSED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.title('');

    let expect = this.client.api.expect.title().to.equal('hp vasq').before(110);
    Nocks.title('hp vasq');

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.retries, 1);
      assert.ok(expect.assertion.message.startsWith('Expected page title to equal: "hp vasq" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });
  });

  it('to equal and waitFor [FAILED] - value not equal', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.title('xx');

    let expect = this.client.api.expect.title().to.equal('hp vasq').before(110);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries >= 1);
      assert.ok(expect.assertion.elapsedTime >= 110);
      assert.equal(expect.assertion.expected, 'equal \'hp vasq\'');
      //assert.equal(expect.assertion.actual, 'xx');
      assert.ok(expect.assertion.message.startsWith('Expected page title to equal: "hp vasq" in 110ms'));
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
      assert.equal(expect.assertion.expected, 'not equal \'xx\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' not equal: "xx"']);
      assert.ok(expect.assertion.message.startsWith('Expected page title to not equal: "xx"'));
    });
  });

  it('to  not contains [PASSED]', function() {
    Nocks.title('xx');

    let expect = this.client.api.expect.title().to.not.contains('vasq');

    assert.ok(expect.assertion.message.startsWith('Expected page title to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not contain \'vasq\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not contain: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected page title to not contain: "vasq"'));
    });
  });

  it('to contain [PASSED]', function() {
    Nocks.title('vasq');

    // let expect = this.client.api.expect.title().to.contains('vasq');
    let expect = this.client.api.expect.title().contains('vasq');

    assert.ok(expect.assertion.message.startsWith('Expected page title to'));

    console.log(expect.assertion.message);

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'contain \'vasq\'');
      assert.equal(expect.assertion.actual, 'vasq');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, 'vasq');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' contain: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected page title to contain: "vasq"'));
    });
  });

  it('to not contain [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.title('xx');

    let expect = this.client.api.expect.title().to.not.contains('xx');
    assert.ok(expect.assertion.message.startsWith('Expected page title to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not contain \'xx\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [ ' not contain: "xx"' ]);
      assert.ok(expect.assertion.message.startsWith('Expected page title to not contain: "xx"'));
    });
  });

  it('to not match [PASSED]', function() {
    Nocks.title('xx');

    let expect = this.client.api.expect.title().to.not.match(/vasq/);

    assert.ok(expect.assertion.message.startsWith('Expected page title to'));

    console.log(expect.assertion.message);
    console.log(expect.assertion.messageParts);

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not match \'/vasq/\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not match: "/vasq/"');
      assert.ok(expect.assertion.message.startsWith('Expected page title to not match: "/vasq/"'));
    });
  });



  it('to not match [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.title('xx');

    let expect = this.client.api.expect.title().to.not.match(/xx/);
    assert.ok(expect.assertion.message.startsWith('Expected page title to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not match \'/xx/\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' not match: "/xx/"']);
      assert.ok(expect.assertion.message.startsWith('Expected page title to not match: "/xx/"'));
    });
  });

  it('to equal to - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.title('');

    let expect = this.client.api.expect.title().to.equal('vasq');
    assert.ok(expect.assertion.message.startsWith('Expected page title to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, null);
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' equal to: "vasq"', ' - element was not found']);
      assert.ok(expect.assertion.message.startsWith('Expected page title to  equal to: "vasq" - element was not found'));
    });
  });

  it('to  which contains - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.title('');

    let expect = this.client.api.expect.title().to.which.contains('vasq');

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' which ', 'contains: "vasq"', ' - element was not found']);
      assert.ok(expect.assertion.message.startsWith('Expected page title to  which contains: "vasq" - element was not found'));
    });
  });

  it('to  match - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.title('');

    let expect = this.client.api.expect.title().to.which.matches(/vasq$/);

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' which ', 'matches: "/vasq$/"', ' - element was not found' ]);
      assert.ok(expect.assertion.message.startsWith('Expected page title to  which matches: "/vasq$/" - element was not found'));
    });
  });

  it('to  equal to with waitFor - element not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.title('');

    let expect = this.client.api.expect.title().to.equal('hp vasq').before(60);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected page title to  equal to: "hp vasq" in 60ms - element was not found'));
    });
  });

  it('to equal with waitFor - element found on retry', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.title('').title('hp vasq');

    let expect = this.client.api.expect.title().to.equal('hp vasq').before(110);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected page title to equal: "hp vasq" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });
  });

  it('to  match - throws exception on invalid regex', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.title('xx');

    let expect = this.client.api.expect.title();
    assert.throws(function() {
      expect.matches('');
    }.bind(this));

    return this.client.start();
  });

  it('to equal and waitFor [FAILED] - value not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.title();

    let expect = this.client.api.expect.title().to.equal('hp vasq').before(110);

    Nocks.title('xx');

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries > 1);
      assert.ok(expect.assertion.message.startsWith('Expected page title to  equal to: "hp vasq" in 110ms'));
    });
  });
});
