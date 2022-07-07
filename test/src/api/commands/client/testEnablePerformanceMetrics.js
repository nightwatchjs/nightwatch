const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');

describe('.enablePerformanceMetrics()', function () {
  beforeEach(function (done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.enablePerformanceMetrics()', function (done) {
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

      client.transport.driver.sendAndGetDevToolsCommand = (command) =>{
        expectedCdpCommands.push(command);
      };
      client.api.enablePerformanceMetrics(undefined, function (){
        assert.deepEqual(expectedCdpCommands, ['Performance.disable', 'Performance.enable']);
      });
      client.start(done);
    });
  });

  it('browser.enablePerformanceMetrics(false)', function (done) {
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

      client.transport.driver.sendAndGetDevToolsCommand = (command) =>{
        expectedCdpCommands.push(command);
      };
      client.api.enablePerformanceMetrics(false, function (){
        assert.deepEqual(expectedCdpCommands, ['Performance.disable']);
      });
      client.start(done);
    });
  });

  it('browser.enablePerformanceMetrics - driver not supported', function(done){
    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'firefox'
      },
      output: process.env.VERBOSE === '1',
      silent: false
    }).then(client => {
      client.api.enablePerformanceMetrics(true, function(result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'The command .enablePerformanceMetrics() is only supported in Chrome and Edge drivers');
      });
      client.start(done);
    });
  });

});
