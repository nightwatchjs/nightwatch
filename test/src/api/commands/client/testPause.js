const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.pause()', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.pause(10) pauses atleast 10ms and not more than 2000ms', function(done) {
    const startTime = new Date();
    this.client.api.pause(10, function() {
      const timeElapsed = new Date() - startTime;
      assert.ok(timeElapsed >= 10);
    });

    this.client.start(done);
  });

  it('browser.pause(0) does not pause more than 2000ms', function(done) {
    const startTime = new Date();
    this.client.api.pause(0, function() {
      const timeElapsed = new Date() - startTime;
      assert.ok(timeElapsed >= 0);
    });

    this.client.start(done);
  });

  it('browser.pause(200) pauses for atleast 200ms and not more than 2000ms', function(done) {
    const startTime = new Date();
    this.client.api.pause(200, function() {
      const timeElapsed = new Date() - startTime;
      assert.ok(timeElapsed >= 200);
    });

    this.client.start(done);
  });

  it('browser.pause() and then resume after 200 ms', function(done) {
    const startTime = new Date();
    this.client.api.pause(undefined, function() {
      const timeElapsed = new Date() - startTime;
      assert.ok(timeElapsed >= 200);
    });

    setTimeout(() => {
      process.stdin.emit('keypress', null, {name: 'return'});
    }, 200);

    this.client.start(done);
  });

  it('browser.pause() and then resume after 1000 ms', function(done) {
    const startTime = new Date();
    this.client.api.pause(undefined, function() {
      const timeElapsed = new Date() - startTime;
      assert.ok(timeElapsed >= 1000);
    });

    setTimeout(() => {
      process.stdin.emit('keypress', null, {name: 'return'});
    }, 1000);

    this.client.start(done);
  });

  it('browser.pause() and then step over using <space>', function(done) {
    const Debuggability = require('../../../../../lib/utils/debuggability.js');

    const startTime = new Date();

    assert.strictEqual(Debuggability.stepOverAndPause, false);
    this.client.api.pause(undefined, function() {
      const timeElapsed = new Date() - startTime;
      assert.ok(timeElapsed >= 200);
      assert.strictEqual(Debuggability.stepOverAndPause, true);
    });

    setTimeout(() => {
      process.stdin.emit('keypress', null, {name: 'space'});
    }, 200);

    this.client.start(done);
  });

  it('browser.pause() and then step over using F10', function(done) {
    const Debuggability = require('../../../../../lib/utils/debuggability.js');

    const startTime = new Date();

    assert.strictEqual(Debuggability.stepOverAndPause, false);
    this.client.api.pause(undefined, function() {
      const timeElapsed = new Date() - startTime;
      assert.ok(timeElapsed >= 200);
      assert.strictEqual(Debuggability.stepOverAndPause, true);
    });

    setTimeout(() => {
      process.stdin.emit('keypress', null, {name: 'f10'});
    }, 200);

    this.client.start(done);
  });

  it('browser.pause() and then exit', function(done) {
    const clientApi = this.client.api;
    const origEndFn = clientApi.end;

    let apiEndCalledWithCallback = false;
    let callbackCalled;
    clientApi.end = (cb) => {
      if (cb) {
        apiEndCalledWithCallback = true;
        callbackCalled = cb;
      }
    };
    
    const startTime = new Date();

    this.client.api.pause(undefined, function() {
      const timeElapsed = new Date() - startTime;
      assert.ok(timeElapsed >= 200);
      assert.strictEqual(apiEndCalledWithCallback, true);
      assert.strictEqual(callbackCalled.toString().includes('process.exit(0)'), true);

      clientApi.end = origEndFn;
    });

    setTimeout(() => {
      process.stdin.emit('keypress', null, {ctrl: true, name: 'c'});
    }, 200);

    this.client.start(done);
  });
});