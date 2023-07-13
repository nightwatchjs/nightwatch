const assert = require('assert');
const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getLog', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.logs.getLog()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/se/log',
      postdata: {
        type: 'driver'
      },
      method: 'POST',
      response: JSON.stringify({
        status: 0,
        value: [
          {level: 'INFO', timestamp: 534557932, message: 'Driver log 1'},
          {level: 650, timestamp: 534563132, message: 'Driver log 2'}
        ]
      })
    }, true);

    let logsReceived;
    const api = this.client.api;

    this.client.api.logs.getLog('driver', function(result) {
      logsReceived = result.value;

      assert.strictEqual(this, api);
    });

    this.client.start(function(err) {
      try {
        assert.strictEqual(err, undefined);

        assert.strictEqual(Array.isArray(logsReceived), true, 'result is array');
        assert.strictEqual(logsReceived.length, 2);
        assert.strictEqual(logsReceived[0].level.name, 'INFO');
        assert.strictEqual(logsReceived[0].level.value, 800);
        assert.strictEqual(logsReceived[1].level.name, 'FINE');
        assert.strictEqual(logsReceived[1].level.value, 500);
        assert.strictEqual(logsReceived[0].message, 'Driver log 1');
        assert.strictEqual(logsReceived[1].message, 'Driver log 2');

        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('client.logs.getLog() implicit', function(done) {
    let logsReceived;
    this.client.api.logs.getLog(function(result) {
      logsReceived = result.value;
    });

    this.client.start(function(err) {
      try {
        assert.strictEqual(err, undefined);
        assert.strictEqual(logsReceived.length, 2);
        assert.strictEqual(Array.isArray(logsReceived), true, 'result is array');
        assert.strictEqual(logsReceived[0].message, 'Test log');

        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('client.logs.getLog() with callback rejecting a Promise', function() {
    this.client.api.logs.getLog('browser', function(result) {
      return new Promise((resolve, reject) => {
        reject(new Error('test error'));
      });
    });

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Error while running "logs.getLog" command: test error');
    });
  });

  it('client.logs.getLog() with callback returning a Promise', function() {
    let logsResult;
    this.client.api.logs.getLog('browser', function(result) {
      logsResult = result.value;

      return new Promise((resolve) => {
        resolve();
      });
    });

    return this.client.start(function() {
      assert.strictEqual(Array.isArray(logsResult), true, 'result is array');
      assert.strictEqual(logsResult.length, 2);
    });
  });

  it('client.getLog()', function(done) {
    const api = this.client.api;
    this.client.api.getLog('browser', function(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(Array.isArray(result), true, 'result is array');
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].message, 'Test log');
      assert.strictEqual(result[1].message, 'Test log2');
    });

    this.client.start(done);
  });

  it('client.getLog() implicit', function(done) {
    this.client.api.getLog(function(result) {
      assert.strictEqual(result.length, 2);
      assert.strictEqual(Array.isArray(result), true, 'result is array');
    });

    this.client.start(done);
  });

  it('client.getLog() with callback rejecting a Promise', function() {
    this.client.api.getLog('browser', function(result) {
      return new Promise((resolve, reject) => {
        reject(new Error('test error'));
      });
    });

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Error while running "getLog" command: test error');
    });
  });

  it('client.getLog() with callback returning a Promise', function() {
    let commandResult;
    this.client.api.getLog('browser', function(result) {
      commandResult = result;

      return new Promise((resolve, reject) => {
        resolve();
      });
    });

    return this.client.start(function(err) {
      assert.strictEqual(Array.isArray(commandResult), true, 'result is array');
      assert.strictEqual(commandResult.length, 2);
    });
  });
});
