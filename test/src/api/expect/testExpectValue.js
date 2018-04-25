const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');

describe('expect.value', function() {
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

  it('to have value equal to [PASSED]', function(done) {
    Nocks.elementFound().value('hp vasq');
    let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "hp vasq"'));
    });

    this.client.start(done);
  });

  it('to have value which equals [PASSED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .value('hp vasq')
      .value('hp vasq')
      .value('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.value.which.equals('hp vasq');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value which equals: "hp vasq"'));
    });

    this.client.start(done);
  });

  it('to have value equal to [FAILED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .value('hp vasq')
      .value('hp vasq')
      .value('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('vasq');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'equal to \'vasq\'');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.actual, 'hp vasq');
      assert.equal(expect.assertion.resultValue, 'hp vasq');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' equal to: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "vasq"'));
    });

    this.client.start(done);
  });

  it('to have value NOT equal to [PASSED]', function(done) {
    Nocks.elementFound().value('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('xx');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.resultValue, 'hp vasq');
      assert.equal(expect.assertion.messageParts[0], ' not equal to: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value not equal to: "xx"'));
    });

    this.client.start(done);
  });

  it('to have value NOT equal to [FAILED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .value('hp vasq')
      .value('hp vasq')
      .value('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('hp vasq');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'not equal to \'hp vasq\'');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.actual, 'hp vasq');
      assert.equal(expect.assertion.resultValue, 'hp vasq');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts, ' not equal to: "hp vasq"' );
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value not equal to: "hp vasq"'));
    });

    this.client.start(done);
  });

  it('to have value equal with waitFor [PASSED]', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);
    Nocks.value(null).value('hp vasq');

    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.retries, 1);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });

    this.client.start(done);
  });

  it('to have value equal and waitFor [FAILED] - value not equal', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().value('xx', 3);

    let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries >= 1);
      assert.ok(expect.assertion.elapsedTime >= 110);
      assert.equal(expect.assertion.expected, 'equal to \'hp vasq\'');
      //assert.equal(expect.assertion.actual, 'xx');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms'));
    });

    this.client.start(done);
  });

  it('to have value not equal to [PASSED]', function(done) {
    Nocks.elementFound().value('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('vasq');
    assert.ok(expect.assertion.message.startsWith('Expected element <%s> to have value'));
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'not equal to \'vasq\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not equal to: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value not equal to: "vasq"'));
    });

    this.client.start(done);
  });

  it('to have value not equal to [FAILED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .value('xx')
      .value('xx')
      .value('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('xx');
    assert.ok(expect.assertion.message.startsWith('Expected element <%s> to have value'));
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'not equal to \'xx\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' not equal to: "xx"']);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value not equal to: "xx"'));
    });

    this.client.start(done);
  });

  it('to have value not contains [PASSED]', function(done) {
    Nocks.elementFound().value('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.value.not.contains('vasq');

    assert.ok(expect.assertion.message.startsWith('Expected element <%s> to have value'));
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'not contain \'vasq\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not contain: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value not contain: "vasq"'));
    });

    this.client.start(done);
  });

  it('to have value contains [PASSED]', function(done) {
    Nocks.elementFound().value('vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.value.which.contains('vasq');

    assert.ok(expect.assertion.message.startsWith('Expected element <%s> to have value'));
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'contains \'vasq\'');
      assert.equal(expect.assertion.actual, 'vasq');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, 'vasq');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' which ');
      assert.equal(expect.assertion.messageParts[1], 'contains: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value which contains: "vasq"'));
    });

    this.client.start(done);
  });

  it('to have value not contains [FAILED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .value('xx')
      .value('xx')
      .value('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.value.not.contains('xx');
    assert.ok(expect.assertion.message.startsWith('Expected element <%s> to have value'));
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'not contain \'xx\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [ ' not contain: "xx"' ]);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value not contain: "xx"'));
    });

    this.client.start(done);
  });

  it('to have value not match [PASSED]', function(done) {
    Nocks.elementFound().value('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.value.not.match(/vasq/);

    assert.ok(expect.assertion.message.startsWith('Expected element <%s> to have value'));
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'not match \'/vasq/\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not match: "/vasq/"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value not match: "/vasq/"'));
    });

    this.client.start(done);
  });

  it('to have value which matches [PASSED]', function(done) {
    Nocks.elementFound().value('vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.value.which.matches(/vasq/);

    assert.ok(expect.assertion.message.startsWith('Expected element <%s> to have value'));
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'matches \'/vasq/\'');
      assert.equal(expect.assertion.actual, 'vasq');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, 'vasq');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' which ');
      assert.equal(expect.assertion.messageParts[1], 'matches: "/vasq/"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value which matches: "/vasq/"'));
    });

    this.client.start(done);
  });

  it('to have value not match [FAILED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .value('xx')
      .value('xx')
      .value('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.value.not.match(/xx/);
    assert.ok(expect.assertion.message.startsWith('Expected element <%s> to have value'));
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'not match \'/xx/\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' not match: "/xx/"']);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value not match: "/xx/"'));
    });

    this.client.start(done);
  });

  it('to have value equal to - element not found', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks
      .elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('vasq');
    assert.ok(expect.assertion.message.startsWith('Expected element <%s> to have value'));
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, null);
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' equal to: "vasq"', ' - element was not found']);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "vasq" - element was not found'));
    });

    this.client.start(done);
  });

  it('to have value which contains - element not found', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks
      .elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.value.which.contains('vasq');

    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' which ', 'contains: "vasq"', ' - element was not found']);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value which contains: "vasq" - element was not found'));
    });

    this.client.start(done);
  });

  it('to have value match - element not found', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks
      .elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.value.which.matches(/vasq$/);

    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' which ', 'matches: "/vasq$/"', ' - element was not found' ]);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value which matches: "/vasq$/" - element was not found'));
    });

    this.client.start(done);
  });

  it('to have value equal to with waitFor - element not found', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(60);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "hp vasq" in 60ms - element was not found'));
    });

    this.client.start(done);
  });

  it('to have value equal with waitFor - element found on retry', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementNotFound().elementFound().value('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);

    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });

    this.client.start(done);
  });

  it('to have value match - throws exception on invalid regex', function(done) {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .value('xx')
      .value('xx')
      .value('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.value;
    assert.throws(function() {
      expect.which.matches('');
    }.bind(this));

    this.client.api.perform(function() {
    });

    this.client.start(done);
  });

  it('to have value equal and waitFor [FAILED] - value not found', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);

    Nocks.elementFound().value('xx', 4);

    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries > 1);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms'));
    });

    this.client.start(done);
  });
});
