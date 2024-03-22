const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');

describe('expect.property', function() {
  beforeEach(function(done) {
    ExpectGlobals.beforeEach.call(this, {
      silent: false,
      output: false
    }, () => {
      this.client.api.globals.abortOnAssertionFailure = true;
      done();
    });
  });

  afterEach(function(done) {
    ExpectGlobals.afterEach.call(this, done);
  });

  it('to have property which matches [PASSED]', function(done) {
    Nocks
      .elementFound()
      .propertyValue('vasq');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('className').which.matches(/vasq/);

    assert.strictEqual(expect.assertion.message, 'Expected element %s to have dom property "className"');
    this.client.api.perform(function() {
      assert.strictEqual(expect.assertion.expected, 'matches \'/vasq/\'');
      assert.strictEqual(expect.assertion.actual, 'vasq');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.resultValue, 'vasq');
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.messageParts[0], ' which ');
      assert.strictEqual(expect.assertion.messageParts[1], 'matches: "/vasq/"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have dom property "className" which matches: "/vasq/"'));
    });

    this.client.start(done);
  });

  it('to have property equals [PASSED] - selector object', function(done) {
    Nocks
      .elementFound()
      .propertyValue('vasq');

    const expect = this.client.api.expect.element({
      selector: '#weblogin'
    }).to.have.property('className').equals('vasq');

    assert.strictEqual(expect.assertion.message, 'Expected element %s to have dom property "className"');

    this.client.api.perform(function() {
      assert.strictEqual(expect.assertion.expected, 'equal to \'vasq\'');
      assert.strictEqual(expect.assertion.actual, 'vasq');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.resultValue, 'vasq');
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have dom property "className" equal to: "vasq"'), expect.assertion.message);
    });

    this.client.start(done);
  });

  it('to have property equals [FAILED] - selector object', function(done) {
    Nocks
      .elementFound()
      .propertyValue('vasq')
      .propertyValue('vasq')
      .propertyValue('vasq');

    const expect = this.client.api.expect.element({
      selector: '#weblogin',
      timeout: 150,
      retryInterval: 100,
      abortOnFailure: false
    }).to.have.property('className').equals('qq');

    this.client.api.perform(function() {
      assert.ok(expect.assertion.retries >= 1);
      assert.strictEqual(expect.assertion.expected, 'equal to \'qq\'');
      assert.strictEqual(expect.assertion.actual, 'vasq');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.resultValue, 'vasq');
      assert.strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have dom property "className" equal to: "qq"'), expect.assertion.message);
    });

    this.client.start(done);
  });

  it('to have property equals [FAILED] - selector object and custom message', function(done) {
    Nocks
      .elementFound()
      .propertyValue('vasq')
      .propertyValue('vasq')
      .propertyValue('vasq');

    const expect = this.client.api.expect.element({
      selector: '#weblogin',
      timeout: 30,
      retryInterval: 20,
      abortOnFailure: false,
      message: 'custom assert message %s'
    }).to.have.property('className').equals('qq');

    this.client.api.perform(function() {
      assert.strictEqual(expect.assertion.passed, false);
      assert.ok(/^custom assert message <#weblogin> - expected "equal to 'qq'" but got: "vasq" \(\d.+\)$/.test(expect.assertion.message), expect.assertion.message);
    });

    this.client.start(done);
  });

  it('to have property which deep equals [PASSED]', function(done) {
    Nocks
      .elementFound()
      .propertyValue(['class-one', 'class-two'], 'classList');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('classList').equal(['class-one', 'class-two']);

    assert.strictEqual(expect.assertion.message, 'Expected element %s to have dom property "classList"');
    this.client.api.perform(function() {
      assert.strictEqual(expect.assertion.expected, 'equal to \'class-one,class-two\'');
      assert.deepStrictEqual(expect.assertion.actual, ['class-one', 'class-two']);
      assert.strictEqual(expect.assertion.negate, false);
      assert.deepStrictEqual(expect.assertion.resultValue, ['class-one', 'class-two']);
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have dom property "classList" equal to: "class-one,class-two"'), expect.assertion.message);
    });

    this.client.start(done);
  });

  it('to have property which contains [PASSED]', function(done) {
    Nocks
      .elementFound()
      .propertyValue(['class-one', 'class-two'], 'classList');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('classList').contain('class-one');

    assert.strictEqual(expect.assertion.message, 'Expected element %s to have dom property "classList"');
    this.client.api.perform(function() {
      assert.strictEqual(expect.assertion.expected, 'contain \'class-one\'');
      assert.deepStrictEqual(expect.assertion.actual, ['class-one', 'class-two']);
      assert.strictEqual(expect.assertion.negate, false);
    });

    this.client.start(done);
  });

  it('to have property which contains and custom waitFor [PASSED]', function(done) {
    Nocks
      .elementFound()
      .propertyValue(['class-one', 'class-two'], 'classList');

    this.client.api.globals.abortOnAssertionFailure = false;
    this.client.api.globals.waitForConditionTimeout = 65;

    let expect = this.client.api.expect.element('#weblogin').to.have.property('classList').contain('class-one').before(100);

    this.client.api.perform(function() {
      assert.strictEqual(expect.assertion.message, 'Expected element <#weblogin> to have dom property "classList" contain: "class-one" in 100ms (' + expect.assertion.elapsedTime + 'ms)');
    });

    this.client.start(done);
  });

  it('to have property which contains and custom waitFor [FAILED] - element not found', function(done) {
    Nocks
      .elementNotFound()
      .elementNotFound();

    this.client.api.globals.abortOnAssertionFailure = false;
    this.client.api.globals.waitForConditionTimeout = 65;
    this.client.api.globals.waitForConditionPollInterval = 55;

    let expect = this.client.api.expect.element('#weblogin').to.have.property('classList').contain('class-one').before(50);

    this.client.api.perform(function() {
      assert.strictEqual(expect.assertion.message, 'Expected element <#weblogin> to have dom property "classList" contain: "class-one" in 50ms - element was not found - expected "contain \'class-one\'" but got: "not present" (' + expect.assertion.elapsedTime + 'ms)');
    });

    this.client.start(done);
  });

  it('to have property contains [FAILED] - property not found', function(done) {
    Nocks
      .elementFound()
      .propertyValue(null, 'classList')
      .propertyValue(null, 'classList')
      .propertyValue(null, 'classList');

    this.client.api.globals.abortOnAssertionFailure = false;
    this.client.api.globals.waitForConditionPollInterval = 20;
    this.client.api.globals.waitForConditionTimeout = 25;

    const expect = this.client.api.expect.element('#weblogin')
      .to.have.property('classList').contain('class-one');

    this.client.api.perform(function() {
      assert.strictEqual(expect.assertion.message, 'Expected element <#weblogin> to have dom property "classList" contain: "class-one" - property was not found - expected "contain \'class-one\'" but got: "null" (' + expect.assertion.elapsedTime + 'ms)');
    });

    this.client.start(done);
  });
});
