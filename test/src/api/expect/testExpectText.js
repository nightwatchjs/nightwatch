const assert = require('assert');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const Nocks = require('../../../lib/nocks.js');
const {strictEqual} = assert;

describe('expect.text', function() {
  const {runExpectAssertion} = ExpectGlobals;

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

  it('text to equal [PASSED]', function() {
    Nocks.elementFound().text('hp vasq');
    let expect = this.client.api.expect.element('#weblogin').text.to.equal('hp vasq');

    return this.client.start(function() {
      strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> text to equal: "hp vasq"'));
    });
  });

  it('text to equal [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .text('hp vasq')
      .text('hp vasq')
      .text('hp vasq');

    return runExpectAssertion.call(this, {
      fn: expect => expect.text.to.equal('vasq'),

      assertion({expected, negate, actual, resultValue, passed, messageParts, message, elapsedTime}) {
        strictEqual(expected, 'equal \'vasq\'');
        strictEqual(negate, false);
        strictEqual(actual, 'hp vasq');
        strictEqual(resultValue, 'hp vasq');
        strictEqual(passed, false);
        strictEqual(messageParts.length, 3);
        strictEqual(message, `Expected element <#weblogin> text to equal: "vasq" - expected "equal 'vasq'" but got: "hp vasq" (${elapsedTime}ms)`);
      }
    });

  });

  it('text to NOT equal [PASSED]', function() {
    Nocks.elementFound().text('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').text.to.not.equal('xx');

    return this.client.start(function() {
      strictEqual(expect.assertion.negate, true);
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.resultValue, 'hp vasq');
      strictEqual(expect.assertion.messageParts[0], ' not equal: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> text to not equal: "xx"'));
    });
  });

  it('text to NOT equal [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .text('hp vasq')
      .text('hp vasq')
      .text('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').text.to.not.equal('hp vasq');

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'not equal \'hp vasq\'');
      strictEqual(expect.assertion.negate, true);
      strictEqual(expect.assertion.actual, 'hp vasq');
      strictEqual(expect.assertion.resultValue, 'hp vasq');
      strictEqual(expect.assertion.passed, false);
      strictEqual(expect.assertion.message, `Expected element <#weblogin> text to not equal: "hp vasq" - expected "not equal 'hp vasq'" but got: "hp vasq" (${expect.assertion.elapsedTime}ms)`);
    });
  });

  it('text to equal with waitFor [PASSED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound();

    let expect = this.client.api.expect.element('#weblogin').text.to.equal('hp vasq').before(100);
    Nocks.text(null).text('hp vasq');

    return this.client.start(function() {
      strictEqual(expect.assertion.waitForMs, 100);
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.retries, 1);
      strictEqual(expect.assertion.message, 'Expected element <#weblogin> text to equal: "hp vasq" in 100ms (' + expect.assertion.elapsedTime + 'ms)');
    });
  });

  it('text to equal and waitFor [FAILED] - text not equal', function() {
    this.client.api.globals.waitForConditionPollInterval = 150;

    Nocks.elementFound().text('xx', 3);

    let expect = this.client.api.expect.element('#weblogin').text.to.equal('hp vasq').before(100);

    return this.client.start(function() {
      strictEqual(expect.assertion.waitForMs, 100);
      strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries >= 1);
      assert.ok(expect.assertion.elapsedTime >= 100);
      strictEqual(expect.assertion.expected, 'equal \'hp vasq\'');
      //strictEqual(expect.assertion.actual, 'xx');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> text to equal: "hp vasq" in 100ms'));
    });
  });

  it('text to not equal [PASSED]', function() {
    Nocks.elementFound().text('xx');

    let expect = this.client.api.expect.element('#weblogin').text.to.not.equal('vasq');
    assert.ok(expect.assertion.message.startsWith('Expected element %s text to'));

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'not equal \'vasq\'');
      strictEqual(expect.assertion.actual, 'xx');
      strictEqual(expect.assertion.negate, true);
      strictEqual(expect.assertion.resultValue, 'xx');
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.messageParts[0], ' not equal: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> text to not equal: "vasq"'));
    });
  });

  it('text to not equal [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .text('xx')
      .text('xx')
      .text('xx');

    let expect = this.client.api.expect.element('#weblogin').text.to.not.equal('xx');
    assert.ok(expect.assertion.message.startsWith('Expected element %s text to'));

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'not equal \'xx\'');
      strictEqual(expect.assertion.actual, 'xx');
      strictEqual(expect.assertion.negate, true);
      strictEqual(expect.assertion.resultValue, 'xx');
      strictEqual(expect.assertion.passed, false);
      strictEqual(expect.assertion.messageParts[0], ' not equal: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> text to not equal: "xx"'));
    });
  });

  it('text to not contain [PASSED]', function() {
    Nocks.elementFound().text('xx');

    let expect = this.client.api.expect.element('#weblogin').text.to.not.contain('vasq');

    assert.ok(expect.assertion.message.startsWith('Expected element %s text to'));

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'not contain \'vasq\'');
      strictEqual(expect.assertion.actual, 'xx');
      strictEqual(expect.assertion.negate, true);
      strictEqual(expect.assertion.resultValue, 'xx');
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.messageParts[0], ' not contain: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> text to not contain: "vasq"'));
    });
  });

  it('text to contain [PASSED]', function() {
    Nocks.elementFound().text('vasq');

    let expect = this.client.api.expect.element('#weblogin').text.to.contain('vasq');

    assert.ok(expect.assertion.message.startsWith('Expected element %s text to'));

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'contain \'vasq\'');
      strictEqual(expect.assertion.actual, 'vasq');
      strictEqual(expect.assertion.negate, false);
      strictEqual(expect.assertion.resultValue, 'vasq');
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.messageParts[0], ' contain: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> text to contain: "vasq"'));
    });
  });

  it('text to startWith [PASSED]', function() {
    Nocks.elementFound().text('vasq');

    let expect = this.client.api.expect.element('#weblogin').text.to.startWith('va');

    assert.ok(expect.assertion.message.startsWith('Expected element %s text to'));

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'start with \'va\'');
      strictEqual(expect.assertion.actual, 'vasq');
      strictEqual(expect.assertion.negate, false);
      strictEqual(expect.assertion.resultValue, 'vasq');
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.messageParts[0], ' start with: "va"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> text to start with: "va"'));
    });
  });

  it('text to endWith [PASSED]', function() {
    Nocks.elementFound().text('vasq');

    let expect = this.client.api.expect.element('#weblogin').text.to.endWith('sq');

    assert.ok(expect.assertion.message.startsWith('Expected element %s text to'));

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'end with \'sq\'');
      strictEqual(expect.assertion.actual, 'vasq');
      strictEqual(expect.assertion.negate, false);
      strictEqual(expect.assertion.resultValue, 'vasq');
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.messageParts[0], ' end with: "sq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> text to end with: "sq"'));
    });
  });

  it('text to not contain [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .text('xx')
      .text('xx')
      .text('xx');

    let expect = this.client.api.expect.element('#weblogin').text.to.not.contains('xx');
    assert.ok(expect.assertion.message.startsWith('Expected element %s text to'));

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'not contain \'xx\'');
      strictEqual(expect.assertion.actual, 'xx');
      strictEqual(expect.assertion.negate, true);
      strictEqual(expect.assertion.resultValue, 'xx');
      strictEqual(expect.assertion.passed, false);
      strictEqual(expect.assertion.message, `Expected element <#weblogin> text to not contain: "xx" - expected "not contain 'xx'" but got: "xx" (${expect.assertion.elapsedTime}ms)`);
    });
  });

  it('text to match [PASSED]', function() {
    Nocks.elementFound().text('vasq');

    let expect = this.client.api.expect.element('#weblogin').text.to.match(/vasq/);

    assert.ok(expect.assertion.message.startsWith('Expected element %s text to'));

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'match \'/vasq/\'');
      strictEqual(expect.assertion.actual, 'vasq');
      strictEqual(expect.assertion.negate, false);
      strictEqual(expect.assertion.resultValue, 'vasq');
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.messageParts[0], ' match: "/vasq/"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> text to match: "/vasq/"'));
    });
  });

  it('text to not match [PASSED]', function() {
    Nocks.elementFound().text('xx');

    let expect = this.client.api.expect.element('#weblogin').text.to.not.match(/vasq/);

    assert.ok(expect.assertion.message.startsWith('Expected element %s text to'));

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'not match \'/vasq/\'');
      strictEqual(expect.assertion.actual, 'xx');
      strictEqual(expect.assertion.negate, true);
      strictEqual(expect.assertion.resultValue, 'xx');
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.messageParts[0], ' not match: "/vasq/"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> text to not match: "/vasq/"'));
    });
  });

  it('text to not match [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .text('xx')
      .text('xx')
      .text('xx');

    let expect = this.client.api.expect.element('#weblogin').text.to.not.match(/xx/);
    assert.ok(expect.assertion.message.startsWith('Expected element %s text to'));

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'not match \'/xx/\'');
      strictEqual(expect.assertion.actual, 'xx');
      strictEqual(expect.assertion.negate, true);
      strictEqual(expect.assertion.resultValue, 'xx');
      strictEqual(expect.assertion.passed, false);
      strictEqual(expect.assertion.message, `Expected element <#weblogin> text to not match: "/xx/" - expected "not match '/xx/'" but got: "xx" (${expect.assertion.elapsedTime}ms)`);
    });
  });

  it('text to equal - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    return runExpectAssertion.call(this, {
      fn: expect => {
        expect.text.to.equal('vasq');
        assert.ok(expect.assertion.message.startsWith('Expected element %s text to'));
      },

      assertion({expected, negate, actual, resultValue, passed, messageParts, message, elapsedTime}) {
        strictEqual(expected, 'equal \'vasq\'');
        strictEqual(actual, 'not present');
        strictEqual(negate, false);
        strictEqual(resultValue, null);
        strictEqual(passed, false);
        assert.ok(messageParts.includes(' equal: "vasq"'));
        assert.ok(messageParts.includes(' - element was not found'));
        strictEqual(message, `Expected element <#weblogin> text to equal: "vasq" - element was not found - expected "equal 'vasq'" but got: "not present" (${elapsedTime}ms)`);
      }
    });
  });

  it('text to contain - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').text.to.contain('vasq');

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'contain \'vasq\'');
      strictEqual(expect.assertion.actual, 'not present');
      strictEqual(expect.assertion.passed, false);
      strictEqual(expect.assertion.message, `Expected element <#weblogin> text to contain: "vasq" - element was not found - expected "contain 'vasq'" but got: "not present" (${expect.assertion.elapsedTime}ms)`);
    });
  });

  it('text to match - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').text.to.match(/vasq$/);

    return this.client.start(function() {
      strictEqual(expect.assertion.expected, 'match \'/vasq$/\'');
      strictEqual(expect.assertion.actual, 'not present');
      strictEqual(expect.assertion.passed, false);
      strictEqual(expect.assertion.message, `Expected element <#weblogin> text to match: "/vasq$/" - element was not found - expected "match '/vasq$/'" but got: "not present" (${expect.assertion.elapsedTime}ms)`);
    });
  });

  it('text to match with waitFor - element not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').text.to.match(/vasq$/).before(60);

    return this.client.start(function() {
      strictEqual(expect.assertion.waitForMs, 60);
      strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> text to match: "/vasq$/" in 60ms - element was not found'));
    });
  });

  it('text to match with waitFor - element found on retry', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementFound().text('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').text.to.match(/vasq$/).before(60);

    return this.client.start(function() {
      strictEqual(expect.assertion.waitForMs, 60);
      strictEqual(expect.assertion.passed, true);
      strictEqual(expect.assertion.message, 'Expected element <#weblogin> text to match: "/vasq$/" in 60ms (' + expect.assertion.elapsedTime + 'ms)');
    });
  });

  it('text to match - throws exception on invalid regex', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .text('xx')
      .text('xx')
      .text('xx');

    let expect = this.client.api.expect.element('#weblogin').text;
    assert.throws(function() {
      expect.which.matches('');
    }.bind(this));

    return this.client.start();
  });
});
