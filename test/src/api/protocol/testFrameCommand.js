const assert = require('assert');
const CommandGlobals = require('../../../lib/globals/commands-w3c');
const commandMocks = require('../../../lib/command-mocks.js');

describe('client.frame()', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done, {globals: {
      waitForConditionTimeout: 50,
      waitForConditionPollInterval: 100
    }});
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .frame with selector', function(done) {
    commandMocks.frame({});

    this.client.api.frame('#weblogin', function(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(function(err) {
      done(err);
    });
  });

  it('test .frame with name selector', function(done) {
    commandMocks.findElements({value: '*[name="login"]', response: {
      value: [{
        'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
      }]
    }});
    commandMocks.frame();
    this.client.api.frame('login', function(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(function(err) {
      done(err);
    });
  });

  it('test .frame with id selector', function(done) {
    commandMocks.findElements({value: '*[id="login"]', response: {
      value: [{
        'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
      }]
    }});
    commandMocks.frame();
    this.client.api.frame('login', function(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(function(err) {
      done(err);
    });
  });


  it('test .frame with bad selector', function(done) {
    commandMocks.findElements({value: 'badElement', response: {value: []}, times: 2});
    commandMocks.findElements({value: '*[name="badElement"]', response: {value: []}, times: 2});
    commandMocks.findElements({value: '*[id="badElement"]', response: {value: []}, times: 2});
    this.client.api.frame('badElement', function(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(function(err) {
      if (err) {
        try {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.message, 'Error while running "frame" command: Unable to locate frame element badElement.');
          done();
        } catch (err) {
          done(err);
        }
       
      } else {
        done(new Error('Should result into error'));
      }
    });
  });
});