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

  it('text to property which matches [PASSED]', function(done) {
    Nocks
      .elementFound()
      .text('vasq');

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.text()).to.match(/vasq/);

    this.client.start(done);
  });

  it('text to property equals [FAILED]', function(done) {
    Nocks
      .elementFound()
      .text('vasq');

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.getText()).to.equal('qq');

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

  it('text to property equals [FAILED] - custom message', function(done) {
    Nocks
      .elementFound()
      .text('vasq');

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.text(), 'custom assert message').to.equal('qq');

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

  it('text to property which deep equals [PASSED]', function(done) {
    Nocks
      .elementFound()
      .text(['class-one', 'class-two']);

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.text()).to.contain('class-one').and.contain('class-two');
  
    this.client.start(done);
  });

  it('text to property which contains [PASSED]', function(done) {
    Nocks
      .elementFound()
      .text(['class-one', 'class-two']);

    let expect = this.client.api.expect.element('#weblogin').text.to.contain('class-one');

    assert.strictEqual(expect.assertion.message, 'Expected element %s text to');
    this.client.api.perform(function() {
      assert.strictEqual(expect.assertion.expected, 'contain \'class-one\'');
      assert.deepStrictEqual(expect.assertion.actual, ['class-one', 'class-two']);
      assert.strictEqual(expect.assertion.negate, false);
    });

    this.client.start(done);
  });

  it('text to property which contains and custom waitFor [FAILED] - element not found', function(done) {
    Nocks
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    this.client.api.globals.abortOnAssertionFailure = true;
    this.client.api.globals.waitForConditionTimeout = 65;
    this.client.api.globals.waitForConditionPollInterval = 55;

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.text()).to.equal('qq');

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

  it('text to property contains [FAILED] - text not found', function(done) {
    Nocks
      .elementFound()
      .text()
      .text()
      .text();

    this.client.api.globals.abortOnAssertionFailure = false;
    this.client.api.globals.waitForConditionPollInterval = 20;
    this.client.api.globals.waitForConditionTimeout = 25;
    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.text()).to.equal('qq');
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
