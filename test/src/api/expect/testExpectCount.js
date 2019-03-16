const assert = require('assert');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const Nocks = require('../../../lib/nocks.js');
const common = require('../../../common.js');
const Logger = common.require('util/logger.js');

describe('expect.count', function() {

  // Logger.enable();
  // Logger.setOutputEnabled(true);


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

  it('count to equal [PASSED]', function() {
    Nocks.elementsFound('.classname')
    let expect = this.client.api.expect.elements('.classname').count.to.equal(4);

    return this.client.start(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to equal: "4"'), expect.assertion.message);
    });
  });

  it('count to equal [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementsFound('.classname');

    let expect = this.client.api.expect.elements('.classname').count.to.equal(5);

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.resultValue, 4);
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' equal: "5"', ' - element was not found']);
      assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to equal: "5" - element was not found'));
    });
  });

  it('count to NOT equal [PASSED]', function() {
    Nocks.elementsFound('.classname')

    let expect = this.client.api.expect.elements('.classname').count.to.not.equal(888);

    return this.client.start(function() {
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.resultValue, 4);
      assert.equal(expect.assertion.messageParts[0], ' not equal: "888"');
      assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to not equal: "888"'));
    });
  });

  it('count to NOT equal [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementsFound('.classname')

    let expect = this.client.api.expect.elements('.classname').count.to.not.equal(4);

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.resultValue, 4);
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' not equal: "4"', ' - element was not found']);
      assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to not equal: "4" - element was not found'));
    });
  });

  it('count to equal with waitFor [PASSED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementsNotFound('.classname');
    Nocks.elementsFound('.classname');

    let expect = this.client.api.expect.elements('.classname').count.to.equal(4).before(100);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 100);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.retries, 1);
      assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to equal: "4" in 100ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });
  });

  it('count to equal and waitFor [FAILED] - count not equal', function() {
    this.client.api.globals.waitForConditionPollInterval = 10;

    Nocks.elementsFound('.classname')

    let expect = this.client.api.expect.elements('.classname').count.to.equal(888).before(25);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 25);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries >= 1);
      assert.ok(expect.assertion.elapsedTime >= 25);
      assert.equal(expect.assertion.expected, 'present');
      //assert.equal(expect.assertion.actual, 'xx');
      assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to equal: "888" in 25ms'));
    });
  });

  it('count to equal - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementsNotFound('.classname')

    let expect = this.client.api.expect.elements('.classname').count.to.equal(4);
    assert.ok(expect.assertion.message.startsWith('Expected elements <%s> count to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, 0);
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' equal: "4"', ' - element was not found']);
      assert.ok(expect.assertion.message.startsWith('Expected elements <.classname> count to equal: "4" - element was not found'));
    });
  });

});
