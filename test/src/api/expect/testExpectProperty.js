const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');

describe('expect.property', function() {
  beforeEach(function(done) {
    ExpectGlobals.beforeEach.call(this, () => {
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

    assert.equal(expect.assertion.message, 'Expected element <%s> to have dom property "className"');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'matches \'/vasq/\'');
      assert.equal(expect.assertion.actual, 'vasq');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, 'vasq');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' which ');
      assert.equal(expect.assertion.messageParts[1], 'matches: "/vasq/"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have dom property "className" which matches: "/vasq/"'));
    });

    this.client.start(done);
  });

  it('to have property which deep equals [PASSED]', function(done) {
    Nocks
      .elementFound()
      .propertyValue(['class-one', 'class-two'], 'classList');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('classList').equal(['class-one', 'class-two']);

    assert.equal(expect.assertion.message, 'Expected element <%s> to have dom property "classList"');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'equal to \'class-one,class-two\'');
      assert.deepStrictEqual(expect.assertion.actual, [ 'class-one', 'class-two' ]);
      assert.equal(expect.assertion.negate, false);
      assert.deepStrictEqual(expect.assertion.resultValue, [ 'class-one', 'class-two' ]);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have dom property "classList" equal to: "class-one,class-two"'), expect.assertion.message);
    });

    this.client.start(done);
  });

  it('to have property which contains [PASSED]', function(done) {
    Nocks
      .elementFound()
      .propertyValue(['class-one', 'class-two'], 'classList');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('classList').contain('class-one');

    assert.equal(expect.assertion.message, 'Expected element <%s> to have dom property "classList"');
    this.client.api.perform(function() {
      assert.equal(expect.assertion.expected, 'contain \'class-one\'');
      assert.deepStrictEqual(expect.assertion.actual, [ 'class-one', 'class-two' ]);
      assert.equal(expect.assertion.negate, false);
    });

    this.client.start(done);
  });
});
