const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const NightwatchClient = common.require('index.js');

describe('testRunnerSessionCreate', function() {
  before(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  it('testRunner with session create error using webdriver', function() {
    let testsPath = path.join(__dirname, '../../sampletests/simple');
    MockServer.addMock({
      url: '/session',
      statusCode: 500,
      postdata: JSON.stringify({
        desiredCapabilities: {
          browserName: 'firefox',
          acceptSslCerts: true,
          platform: 'ANY',
          name: 'test-Name'
        }
      }),
      response: JSON.stringify({
        value: {
          error: 'session not created',
          message: 'Session is already started'
        }
      })
    }, true);

    let globals = {
      reporter(results) {
        assert.ok(results.lastError instanceof Error);
        assert.ok(results.lastError.message.includes('An occurred error while retrieving a new session: "Session is already started"'));
      }
    };

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        port: 10195,
        version2: false,
        start_process: false
      },
      output: false,
      silent: false,
      globals: globals,
      output_folder: false
    });
  });
});
