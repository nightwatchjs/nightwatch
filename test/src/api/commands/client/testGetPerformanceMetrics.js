const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');

describe('.getPerformanceMetrics()', function () {
  beforeEach(function (done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.getPerformanceMetrics()', function (done) {
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
      },
      output: process.env.VERBOSE === '1',
      silent: false
    }).then(client => {
      const expectedCdpCommands = [];

      const cdpReturnedMetrics = {
        metrics: [
          {name: 'Documents', value: 1},
          {name: 'Frames', value: 5},
          {name: 'LayoutCount', value: 82}
        ]
      };
      const finalReturnedMetrics = {
        'Documents': 1,
        'Frames': 5,
        'LayoutCount': 82
      };

      client.transport.driver.sendAndGetDevToolsCommand = (command) =>{
        expectedCdpCommands.push(command);

        return Promise.resolve(cdpReturnedMetrics);
      };
      client.api.getPerformanceMetrics(function (metrics) {
        assert.deepEqual(metrics.value, finalReturnedMetrics);
        assert.deepEqual(expectedCdpCommands, ['Performance.getMetrics']);
      });
      client.start(done);
    });
  });

  it('browser.getPerformanceMetrics - driver not supported', function(done){
    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'firefox'
      },
      output: process.env.VERBOSE === '1',
      silent: false
    }).then(client => {
      client.api.getPerformanceMetrics(function(result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'The command .getPerformanceMetrics() is only supported in Chrome and Edge drivers');
      });
      client.start(done);
    });
  });

});
