const assert = require('assert');
const Nocks = require('../../../lib/nocks.js');
const ExpectGlobals = require('../../../lib/globals/expect.js');

describe('expect(element.attribute)', function() {
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

  it('to have attribute which matches [PASSED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 0;

    Nocks
      .elementFound()
      .attributeValueSync('vasq');
    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.attribute('class')).which.matches(/vasq/);

    this.client.start(done);
  });

  it('to have attribute equals [FAILED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 0;

    Nocks
      .elementFound()
      .attributeValueSync('vasq');

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.getAttribute('class')).to.equal('qq');

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

  it('to have attribute equals [FAILED] - custom message', function(done) {
    this.client.api.globals.waitForConditionTimeout = 0;

    Nocks
      .elementFound()
      .attributeValueSync('vasq');

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.attribute('class'), 'custom assert message').to.equal('qq');

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

  it('to have attribute which deep equals [PASSED]', function(done) {
    this.client.api.globals.waitForConditionTimeout = 0;

    Nocks
      .elementFound()
      .attributeValueSync(['class-one', 'class-two']);

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.attribute('class')).to.contain('class-one').and.contain('class-two');
  
    this.client.start(done);
  });


  it('to have attribute which contains and custom waitFor [FAILED] - element not found', function(done) {
    Nocks
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    this.client.api.globals.abortOnAssertionFailure = true;
    this.client.api.globals.waitForConditionTimeout = 65;
    this.client.api.globals.waitForConditionPollInterval = 55;

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.attribute('class')).to.equal('qq');

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

  it('to have attribute contains [FAILED] - attribute not found', function(done) {
    Nocks
      .elementFound()
      .attributeValueSync()
      .attributeValueSync()
      .attributeValueSync();

    this.client.api.globals.abortOnAssertionFailure = false;
    this.client.api.globals.waitForConditionTimeout = 0;
    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.attribute('class')).to.equal('qq');
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
