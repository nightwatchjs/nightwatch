const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');

describe('.setNetworkConditions()', function () {
  beforeEach(function (done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.setNetworkConditions()', function (done) {
    MockServer.addMock(
      {
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
      },
      true
    );

    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {}
      },
      output: process.env.VERBOSE === '1',
      silent: false
    }).then((client) => {
      const expected = {};

      client.transport.driver.setNetworkConditions = function (spec) {
        expected['download_throughput'] = spec.download_throughput;
        expected['latency'] = spec.latency;
        expected['offline'] = spec.offline;
        expected['upload_throughput'] = spec.upload_throughput;

        return Promise.resolve();
      };

      client.api.setNetworkConditions({
        offline: false,
        latency: 50000,
        download_throughput: 450 * 1024,
        upload_throughput: 150 * 1024
      },
      function (result) {
        assert.deepStrictEqual(result.value, null);
        assert.strictEqual(expected.download_throughput, 460800);
        assert.strictEqual(expected.latency, 50000);
        assert.strictEqual(expected.offline, false);
        assert.strictEqual(expected.upload_throughput, 153600);
      });
      client.start(done);
    });
  });

  it('browser.setNetworkConditions - driver not supported', function (done) {
    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'firefox'
      },
      output: process.env.VERBOSE === '1',
      silent: false
    }).then((client) => {
      client.api.setNetworkConditions({
        offline: false,
        latency: 50000,
        download_throughput: 450 * 1024,
        upload_throughput: 150 * 1024
      },
      function (result) {
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'SetNetworkConditions is not supported while using this driver');
      }
      );
      client.start(done);
    });
  });
});
