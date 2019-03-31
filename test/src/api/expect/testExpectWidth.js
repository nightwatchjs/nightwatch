const assert = require('assert');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const Nocks = require('../../../lib/nocks.js');

describe('expect.width', function() {
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

  it('width to equal [PASSED]', function() {
    Nocks.elementFound().width('33');
    let expect = this.client.api.expect.element('#weblogin').width.to.equal('33');

    return this.client.start(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> width to equal: "33"'));
    });
  });

  it('width to equal [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .width('33')
      .width('33')
      .width('33');

    let expect = this.client.api.expect.element('#weblogin').width.to.equal('vasq');

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'equal \'vasq\'');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.actual, '33');
      assert.equal(expect.assertion.resultValue, '33');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' equal: "vasq"']);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> width to equal: "vasq"'));
    });
  });

  it('width to NOT equal [PASSED]', function() {
    Nocks.elementFound().width('33');

    let expect = this.client.api.expect.element('#weblogin').width.to.not.equal('xx');

    return this.client.start(function() {
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.resultValue, '33');
      assert.equal(expect.assertion.messageParts[0], ' not equal: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> width to not equal: "xx"'));
    });
  });

  it('width to NOT equal [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .width('33')
      .width('33')
      .width('33');

    let expect = this.client.api.expect.element('#weblogin').width.to.not.equal('33');

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not equal \'33\'');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.actual, '33');
      assert.equal(expect.assertion.resultValue, '33');
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' not equal: "33"']);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> width to not equal: "33"'));
    });
  });

  it('width to equal with waitFor [PASSED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks
      .elementFound();

    let expect = this.client.api.expect.element('#weblogin').width.to.equal('33').before(100);
    Nocks.width(null)
      .width('33')
      .width('33')
      .width('33');

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 100);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.retries, 1);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> width to equal: "33" in 100ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });
  });

  it('width to equal and waitFor [FAILED] - width not equal', function() {
    this.client.api.globals.waitForConditionPollInterval = 10;

    Nocks.elementFound()
      .width('xx')
      .width('xx')
      .width('xx')
      .width('xx');

    let expect = this.client.api.expect.element('#weblogin').width.to.equal('33').before(25);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 25);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries >= 1);
      assert.ok(expect.assertion.elapsedTime >= 25);
      assert.equal(expect.assertion.expected, 'equal \'33\'');
      //assert.equal(expect.assertion.actual, 'xx');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> width to equal: "33" in 25ms'));
    });
  });

  it('width to not equal [PASSED]', function() {
    Nocks.elementFound().width('xx');

    let expect = this.client.api.expect.element('#weblogin').width.to.not.equal('vasq');
    assert.ok(expect.assertion.message.startsWith('Expected element <%s> width to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not equal \'vasq\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not equal: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> width to not equal: "vasq"'));
    });
  });

  it('width to not equal [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .width('xx')
      .width('xx')
      .width('xx');

    let expect = this.client.api.expect.element('#weblogin').width.to.not.equal('xx');
    assert.ok(expect.assertion.message.startsWith('Expected element <%s> width to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not equal \'xx\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' not equal: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> width to not equal: "xx"'));
    });
  });

  it('width to equal - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').width.to.equal('vasq');
    assert.ok(expect.assertion.message.startsWith('Expected element <%s> width to'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, null);
      assert.equal(expect.assertion.passed, false);
      assert.deepEqual(expect.assertion.messageParts, [' equal: "vasq"', ' - element was not found']);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> width to equal: "vasq" - element was not found'));
    });
  });

});
