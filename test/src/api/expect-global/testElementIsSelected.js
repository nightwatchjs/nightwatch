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

  it('is selected property which matches [PASSED]', function(done) {
    Nocks
      .elementFound()
      .selected();
    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.isSelected()).which.matches(/true/);

    this.client.start(done);
  });

  it('is selected property equals [FAILED]', function(done) {
    Nocks
      .elementFound()
      .selected();

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.isSelected()).to.equal(false);

    this.client.start((error)=>{
      try {
        assert.ok(error);
        assert.strictEqual(error.name, 'NightwatchAssertError');
        assert.ok(error.message.startsWith('expected true to equal false'));
        done();
      } catch (err){
        done(err);
      }
    });
  });

  it('is selected property equals [FAILED] - custom message', function(done) {
    Nocks
      .elementFound()
      .selected();

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.isSelected(), 'custom assert message').to.equal(false);

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

  it('is selected property which contains and custom waitFor [FAILED] - element not found', function(done) {
    Nocks
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    this.client.api.globals.abortOnAssertionFailure = true;
    this.client.api.globals.waitForConditionTimeout = 65;
    this.client.api.globals.waitForConditionPollInterval = 55;

    const weblogin = this.client.api.createElement('#weblogin');
    this.client.api.expect(weblogin.isSelected()).to.equal(false);

    this.client.start((error)=>{
      try {
        assert.ok(error);
        assert.strictEqual(error.name, 'NightwatchAssertError');
        assert.ok(error.message.startsWith('expected null to equal false'));
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
