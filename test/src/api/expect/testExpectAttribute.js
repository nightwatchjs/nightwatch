const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');

describe('expect.attribute', function() {
  beforeEach(function(done) {
    ExpectGlobals.beforeEach.call(this, () => {
      this.client.api.globals.abortOnAssertionFailure = true;
      done();
    });
  });

  afterEach(function(done) {
    ExpectGlobals.afterEach.call(this, done);
  });

  it('to have attribute [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('hp vasq');
    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');
    this.client.api.globals.waitForConditionTimeout = 65;

    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.attribute, 'class');
      assert.equal(expect.assertion.resultValue, 'hp vasq');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have attribute "class"'));
    });

    this.client.start(done);
  });

  it('to have attribute with waitFor [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(100);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 100);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.abortOnFailure, true);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 100ms - attribute was present in ' + expect.assertion.elapsedTime + 'ms');
    });

    this.client.start(done);
  });

  it('to have attribute with implicit waitFor [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('hp vasq');
    this.client.api.globals.abortOnAssertionFailure = false;
    this.client.api.globals.waitForConditionTimeout = 65;

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 65);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" - attribute was present in ' + expect.assertion.elapsedTime + 'ms');
    });

    this.client.start(done);
  });

  it('to have attribute with implicit and custom waitFor [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('hp vasq');
    this.client.api.globals.abortOnAssertionFailure = false;
    this.client.api.globals.waitForConditionTimeout = 65;

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(100);
    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 100);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 100ms - attribute was present in ' + expect.assertion.elapsedTime + 'ms');
    });

    this.client.start(done);
  });

  it('to have attribute with waitFor [FAILED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound()
      .attributeValue(null)
      .attributeValue(null)
      .attributeValue(null);

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(60);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.abortOnFailure, true);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 60ms - attribute was not found');
    });
  });

  it('to have attribute with implicit and custom waitFor [FAILED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound()
      .attributeValue(null)
      .attributeValue(null)
      .attributeValue(null);

    this.client.api.globals.waitForConditionTimeout = 65;

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(100);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 100);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 100ms - attribute was not found');
    });
  });

  it('to have attribute with message [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has "class"');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.includes('Testing if #weblogin has "class"'));
    });

    this.client.start(done);
  });

  it('to have attribute with message [FAILED]', function() {
    this.client.api.globals.abortOnAssertionFailure = true;
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .attributeValue(null)
      .attributeValue(null)
      .attributeValue(null)
      .attributeValue(null);

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has "class"');

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.includes('Testing if #weblogin has "class" - attribute was not found'));
    });
  });

  it('to have attribute [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .attributeValue(null)
      .attributeValue(null)
      .attributeValue(null)
      .attributeValue(null);

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'found');
      assert.equal(expect.assertion.actual, 'not found');
      assert.equal(expect.assertion.attribute, 'class');
      assert.equal(expect.assertion.resultValue, null);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" - attribute was not found');
      assert.deepEqual(expect.assertion.messageParts, [' - attribute was not found']);
    });
  });

  it('to not have attribute [PASSED]', function(done) {
    Nocks.elementFound().attributeValue(null);

    let expect = this.client.api.expect.element('#weblogin').to.not.have.attribute('class');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.expected, 'not found');
      assert.equal(expect.assertion.actual, 'not found');
      assert.equal(expect.assertion.resultValue, null);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not have attribute "class"');
      assert.deepEqual(expect.assertion.messageParts, []);
    });

    this.client.start(done);
  });

  it('to not have attribute [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .attributeValue('')
      .attributeValue('')
      .attributeValue('')
      .attributeValue('');

    let expect = this.client.api.expect.element('#weblogin').to.not.have.attribute('class');

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'not found');
      assert.equal(expect.assertion.actual, 'found');
      assert.equal(expect.assertion.resultValue, '');
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not have attribute "class"');
      assert.deepEqual(expect.assertion.messageParts, []);
    });
  });

  it('to have attribute - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.resultValue, null);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" - element was not found');
      assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
    });
  });

  it('to have attribute equal to [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('hp vasq');
    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have attribute "class" equal to: "hp vasq"'));
    });

    this.client.start(done);
  });

  it('to have attribute which equals [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('hp vasq');
    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.equals('hp vasq');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have attribute "class" which equals: "hp vasq"'));
    });

    this.client.start(done);
  });

  it('to have attribute which startsWith [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('hp vasq');
    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.startsWith('hp');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have attribute "class" which starts with: "hp"'), 'Failed: ' + expect.assertion.message);
    });

    this.client.start(done);
  });

  it('to have attribute startWith [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('hp vasq');
    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').startWith('hp');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have attribute "class" start with: "hp"'), 'Failed: ' + expect.assertion.message);
    });

    this.client.start(done);
  });

  it('to have attribute which endsWith [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('hp vasq');
    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.endsWith('vasq');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have attribute "class" which ends with: "vasq"'), 'Failed: ' + expect.assertion.message);
    });

    this.client.start(done);
  });

  it('to have attribute endsWith [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('hp vasq');
    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').endsWith('vasq');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have attribute "class" end with: "vasq"'), 'Failed: ' + expect.assertion.message);
    });

    this.client.start(done);
  });

  it('to have attribute equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .attributeValue('hp vasq')
      .attributeValue('hp vasq')
      .attributeValue('hp vasq')
      .attributeValue('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('vasq');

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.equal(expect.assertion.expected, 'equal to \'vasq\'');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.actual, 'hp vasq');
      assert.equal(expect.assertion.resultValue, 'hp vasq');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [ ' equal to: "vasq"'] );
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "vasq"');
    });
  });

  it('to have attribute NOT equal to [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.equal('xx');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.actual, 'hp vasq');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.resultValue, 'hp vasq');
      assert.equal(expect.assertion.messageParts[0], ' not equal to: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have attribute "class" not equal to: "xx"'));
    });

    this.client.start(done);
  });

  it('to have attribute NOT equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .attributeValue('hp vasq')
      .attributeValue('hp vasq')
      .attributeValue('hp vasq')
      .attributeValue('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.equal('hp vasq');

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.equal(expect.assertion.expected, 'not equal to \'hp vasq\'');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.actual, 'hp vasq');
      assert.equal(expect.assertion.resultValue, 'hp vasq');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' not equal to: "hp vasq"');
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not equal to: "hp vasq"');
    });
  });

  it('to have attribute equal with waitFor [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 10;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound();
    Nocks.attributeValue(null).attributeValue('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(110);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.retries, 1);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
    });
  });

  it('to have attribute equal with custom waitFor [PASSED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    this.client.api.globals.waitForConditionTimeout = 100;
    Nocks.elementFound();
    Nocks.attributeValue(null).attributeValue('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(60);

    return this.client.start(function() {
      assert.equal(expect.assertion.retries, 1);
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 60ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
    });
  });

  it('to have attribute equal and waitFor [FAILED] - attribute not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(110);
    Nocks.attributeValue(null)
      .attributeValue(null)
      .attributeValue(null);

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries > 1);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 110ms - attribute was not found');
    });
  });

  it('to have attribute equal and custom waitFor [FAILED] - attribute not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 35;
    this.client.api.globals.waitForConditionTimeout = 100;
    Nocks.elementFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(60);
    Nocks.attributeValue(null)
      .attributeValue(null)
      .attributeValue(null)
      .attributeValue(null);

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries > 1);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 60ms - attribute was not found');
    });
  });

  it('to have attribute equal and waitFor [FAILED] - attribute not equal', function() {
    this.client.api.globals.waitForConditionPollInterval = 10;
    Nocks.elementFound().attributeValue('xx').attributeValue('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(11);

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.equal(expect.assertion.waitForMs, 11);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries >= 1);
      assert.ok(expect.assertion.elapsedTime >= 11);
      assert.equal(expect.assertion.expected, 'equal to \'hp vasq\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 11ms');
    });
  });

  it('to have attribute equal to with message [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has class which equals hp vasq').equal('hp vasq');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Testing if #weblogin has class which equals hp vasq'));
    });

    this.client.start(done);
  });

  it('to have attribute equal with message [FAILED] - attribute not found', function() {
    Nocks.elementFound()
      .attributeValue(null)
      .attributeValue(null)
      .attributeValue(null)
      .attributeValue(null);

    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has class which equals hp vasq').equal('hp vasq');

    return this.client.start(function(err) {
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.message, 'Testing if #weblogin has class which equals hp vasq - attribute was not found');
    });
  });

  it('to have attribute equal with message [FAILED] - attribute not equal', function() {
    Nocks.elementFound()
      .attributeValue('xx')
      .attributeValue('xx')
      .attributeValue('xx');
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has class which equals hp vasq').equal('hp vasq');

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.actual, 'xx');
      assert.ok(expect.assertion.message.startsWith('Testing if #weblogin has class which equals hp vasq'));
    });
  });

  it('to have attribute not contains [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.contains('vasq');

    assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'not contain \'vasq\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not contain: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have attribute "class" not contain: "vasq"'));
    });

    this.client.start(done);
  });

  it('to have attribute not startsWith [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.startsWith('vasq');

    assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'not start with \'vasq\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not start with: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have attribute "class" not start with: "vasq"'));
    });

    this.client.start(done);
  });

  it('to have attribute not endsWith [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.endsWith('vasq');

    assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'not end with \'vasq\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not end with: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have attribute "class" not end with: "vasq"'));
    });

    this.client.start(done);
  });

  it('to have attribute which contains [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.contains('vasq');

    assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'contains \'vasq\'');
      assert.equal(expect.assertion.actual, 'vasq');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, 'vasq');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' which ');
      assert.equal(expect.assertion.messageParts[1], 'contains: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have attribute "class" which contains: "vasq"'));
    });

    this.client.start(done);
  });

  it('to have attribute not contains [FAILED]', function() {
    Nocks.elementFound()
      .attributeValue('xx')
      .attributeValue('xx')
      .attributeValue('xx')
      .attributeValue('xx');

    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.contains('xx');
    assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.equal(expect.assertion.expected, 'not contain \'xx\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' not contain: "xx"' );
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not contain: "xx"');
    });
  });

  it('to have attribute not startsWith [FAILED]', function() {
    Nocks.elementFound()
      .attributeValue('xx')
      .attributeValue('xx')
      .attributeValue('xx')
      .attributeValue('xx');

    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.startsWith('xx');
    assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.equal(expect.assertion.expected, 'not start with \'xx\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' not start with: "xx"' );
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not start with: "xx"');
    });
  });

  it('to have attribute not endsWith [FAILED]', function() {
    Nocks.elementFound()
      .attributeValue('xx')
      .attributeValue('xx')
      .attributeValue('xx')
      .attributeValue('xx');

    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.endsWith('xx');
    assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.equal(expect.assertion.expected, 'not end with \'xx\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' not end with: "xx"' );
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not end with: "xx"');
    });
  });

  it('to have attribute which matches [PASSED]', function(done) {
    Nocks.elementFound()
      .attributeValue('vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.matches(/vasq/);

    assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'matches \'/vasq/\'');
      assert.equal(expect.assertion.actual, 'vasq');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, 'vasq');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' which ');
      assert.equal(expect.assertion.messageParts[1], 'matches: "/vasq/"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have attribute "class" which matches: "/vasq/"'));
    });

    this.client.start(done);
  });

  it('to have attribute not match [PASSED]', function(done) {
    Nocks.elementFound().attributeValue('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.match(/vasq/);

    assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'not match \'/vasq/\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not match: "/vasq/"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have attribute "class" not match: "/vasq/"'));
    });

    this.client.start(done);
  });

  it('to have attribute not match [FAILED]', function() {
    Nocks.elementFound()
      .attributeValue('xx')
      .attributeValue('xx')
      .attributeValue('xx')
      .attributeValue('xx');

    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.match(/xx/);
    assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.equal(expect.assertion.expected, 'not match \'/xx/\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' not match: "/xx/"');
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not match: "/xx/"');
    });
  });

  it('to have attribute equal to - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('vasq');
    assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, null);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' equal to: "vasq"', ' - element was not found');
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "vasq" - element was not found');
    });
  });

  it('to have attribute contains - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.contains('vasq');

    return this.client.start(function(err) {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' which ');
      assert.equal(expect.assertion.messageParts[1], 'contains: "vasq"');
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" which contains: "vasq" - element was not found');
    });
  });

  it('to have attribute startsWith - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.startsWith('vas');

    return this.client.start(function(err) {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' which ');
      assert.equal(expect.assertion.messageParts[1], 'starts with: "vas"');
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" which starts with: "vas" - element was not found');
    });
  });

  it('to have attribute endsWith - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.endsWith('sq');

    return this.client.start(function(err) {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' which ');
      assert.equal(expect.assertion.messageParts[1], 'ends with: "sq"');
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" which ends with: "sq" - element was not found');
    });
  });

  it('to have attribute match - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.matches(/vasq$/);

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' which ', 'matches: "/vasq$/"', ' - element was not found']);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" which matches: "/vasq$/" - element was not found');
    });
  });

  it('to have attribute with waitFor - element not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(60);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 60ms - element was not found');
    });
  });

  it('to have attribute with custom waitFor - element not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    this.client.api.globals.waitForConditionTimeout = 40;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(100);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 100);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 100ms - element was not found');
    });
  });

  it('to have attribute with waitFor - element found on retry', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementFound().attributeValue('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(60);

    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 60ms - attribute was present in ' + expect.assertion.elapsedTime + 'ms');
    });

    this.client.start(done);
  });

  it('to have attribute with custom waitFor - element found on retry', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    this.client.api.globals.waitForConditionTimeout = 60;
    Nocks.elementNotFound().elementFound().attributeValue('hp vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(100);

    this.client.api.perform(function() {
      assert.equal(expect.assertion.waitForMs, 100);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 100ms - attribute was present in ' + expect.assertion.elapsedTime + 'ms');
    });

    this.client.start(done);
  });

  it('to have attribute match - throws exception on invalid regex', function() {
    Nocks.elementFound().attributeValue('xx');
    let expectedError;
    let expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');
    try {
      expect.which.matches('');
    } catch (err) {
      expectedError = err;
    }

    assert.ok(expectedError instanceof Error);
    assert.strictEqual(expectedError.message, 'matches requires first paramter to be a RegExp. string given.');
  });
});
