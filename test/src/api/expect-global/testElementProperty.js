const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');

describe('expect(element.property)', function() {
  beforeEach(function(done) {
    ExpectGlobals.beforeEach.call(this, {
      silent: true,
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
    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.property('className')).which.matches(/vasq/);

    this.client.start(done);
  });

  it('to have property equals [FAILED]', function(done) {
    Nocks
      .elementFound()
      .propertyValue('vasq');

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.getProperty('className')).to.equal('qq');

    this.client.start((error)=>{
      try {
        assert.ok(error);
        assert.strictEqual(error.name, 'NightwatchAssertError');
        assert.ok(error.message.startsWith('expected \'vasq\' to equal \'qq\''));
        done();
      } catch (err){
        done(err);
      }
    });
  });

  it('to have property equals [FAILED] - custom message', function(done) {
    Nocks
      .elementFound()
      .propertyValue('vasq');

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.property('className'), 'custom assert message').to.equal('qq');

    this.client.start((error)=>{
      try {
        assert.ok(error);
        assert.strictEqual(error.name, 'NightwatchAssertError');
        assert.ok(error.message.startsWith('custom assert message'));
        done();
      } catch (err){
        done(err);
      }
    });
  });

  it('to have property which deep equals [PASSED]', function(done) {
    Nocks
      .elementFound()
      .propertyValue(['class-one', 'class-two'], 'classList');

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.property('classList')).to.contain('class-one').and.contain('class-two');
  
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

  it('to have property which contains and custom waitFor [FAILED] - element not found', function(done) {
    Nocks
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    this.client.api.globals.abortOnAssertionFailure = true;
    this.client.api.globals.waitForConditionTimeout = 65;
    this.client.api.globals.waitForConditionPollInterval = 55;

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.property('className')).to.equal('qq');

    this.client.start((error)=>{
      try {
        assert.ok(error);
        assert.strictEqual(error.name, 'NightwatchAssertError');
        assert.ok(error.message.startsWith('expected null to equal \'qq\''));
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('to have property contains [FAILED] - property not found', function(done) {
    Nocks
      .elementFound()
      .propertyValue(null, 'className')
      .propertyValue(null, 'className')
      .propertyValue(null, 'className');

    this.client.api.globals.abortOnAssertionFailure = false;
    this.client.api.globals.waitForConditionPollInterval = 20;
    this.client.api.globals.waitForConditionTimeout = 25;
    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.property('className')).to.equal('qq');
    this.client.start((error)=>{
      try {
        assert.ok(error);
        assert.strictEqual(error.name, 'NightwatchAssertError');
        assert.ok(error.message.startsWith('expected null to equal \'qq\''));
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
