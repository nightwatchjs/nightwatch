const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');
const fs = require('fs');
const cdp = require('../../../../../lib/transport/selenium-webdriver/cdp.js');

describe('.takeHeapSnapshot()', function(done) {
  beforeEach(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function(done) {
    delete require.cache['fs'];
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.takeHeapSnapshot(heapSnapshotLocation)', function(done) {
    MockServer.addMock({
      url: '/session',
      response: {
        value: {
          sessionId: '13521-10219-202',
          capabilities: {
            browserName: 'chrome',
            browserVersion: '92.0'
          }
        }
      },
      method: 'POST',
      statusCode: 201
    }, true);

    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {}
      }
    }).then(client => {
      const expected = {
        cdpCommands: []
      };

      // Parameters of actual request made by browser
      const cdpAddHeapSnapshotChunkEvent = JSON.stringify({
        method: 'HeapProfiler.addHeapSnapshotChunk',
        params: {
          chunk: 'hello123'
        }
      });

      cdp.resetConnection();
      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve({
          _wsConnection: {
            on: (event, callback) => {
              expected['wsEvent'] = event;
              callback(cdpAddHeapSnapshotChunkEvent);
            }
          },
          execute: function(command, params) {
            expected.cdpCommands.push(command);
            assert.deepEqual(params, {});
          }
        });
      };

      fs.writeFileSync = (filename, content) => {
        expected['heapSnapshotLocation'] = filename;
        expected['heapSnapshotContent'] = content;
      };

      const heapsnapshotLocation = 'snap.heapsnapshot';
      client.api.takeHeapSnapshot(heapsnapshotLocation, function () {
        assert.strictEqual(expected.heapSnapshotLocation, heapsnapshotLocation);
        assert.strictEqual(expected.heapSnapshotContent, JSON.parse(cdpAddHeapSnapshotChunkEvent).params.chunk);
        assert.strictEqual(expected.wsEvent, 'message');
        assert.deepEqual(expected.cdpCommands, ['HeapProfiler.enable', 'HeapProfiler.takeHeapSnapshot']);
      });
  
      client.start(done);
    });
  });

  it('browser.takeHeapSnapshot(undefined, callback)', function(done) {
    MockServer.addMock({
      url: '/session',
      response: {
        value: {
          sessionId: '13521-10219-202',
          capabilities: {
            browserName: 'chrome',
            browserVersion: '92.0'
          }
        }
      },
      method: 'POST',
      statusCode: 201
    }, true);

    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {}
      }
    }).then(client => {
      const expected = {
        cdpCommands: []
      };

      // Parameters of actual request made by browser
      const cdpAddHeapSnapshotChunkEvent = JSON.stringify({
        method: 'HeapProfiler.addHeapSnapshotChunk',
        params: {
          chunk: 'hello123'
        }
      });

      cdp.resetConnection();
      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve({
          _wsConnection: {
            on: (event, callback) => {
              expected['wsEvent'] = event;
              callback(cdpAddHeapSnapshotChunkEvent);
            }
          },
          execute: function(command, params) {
            expected.cdpCommands.push(command);
            assert.deepEqual(params, {});
          }
        });
      };

      fs.writeFileSync = (filename, content) => {
        expected['heapSnapshotLocation'] = filename;
        expected['heapSnapshotContent'] = content;
      };

      client.api.takeHeapSnapshot(undefined, function (result) {
        // fs.writeFileSync was never called
        assert.strictEqual(expected.heapSnapshotLocation, undefined);
        assert.strictEqual(expected.heapSnapshotContent, undefined);

        // Heap snapshot is passed as an argument to callback
        assert.strictEqual(result.value, JSON.parse(cdpAddHeapSnapshotChunkEvent).params.chunk);

        assert.strictEqual(expected.wsEvent, 'message');
        assert.deepEqual(expected.cdpCommands, ['HeapProfiler.enable', 'HeapProfiler.takeHeapSnapshot']);
      });
  
      client.start(done);
    });
  });

  it('browser.takeHeapSnapshot - driver not supported', function(done) {
    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'firefox'
      }
    }).then(client => {
      client.api.takeHeapSnapshot('snap.heapsnapshot', function(result) {
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'The command .takeHeapSnapshot() is only supported in Chrome and Edge drivers');
      });
      client.start(done);
    });
  });
});
