const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunner using within', function() {
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

  it('test Runner with within', function() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      postdata: '{"using":"css selector","value":"#finlandia"}',
      response: JSON.stringify({sessionId: '1352110219202', status: 0, value: [{ELEMENT: '10'}]})
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      statusCode: 200,
      method: 'POST',
      response: JSON.stringify({sessionId: '1352110219202', status: 0, value: true})
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/elements',
      response: JSON.stringify({sessionId: '1352110219202', status: 0, value: [{ELEMENT: '10'}]})
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/10/click',
      response: JSON.stringify({sessionId: '1352110219202', status: 0, value: null})
    });

    const testsPath = path.join(__dirname, '../../sampletests/usingwithin');
    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }

        assert.strictEqual(results.passed, 3);
        assert.strictEqual(results.failed, 0);
        assert.strictEqual(results.errors, 0);
      }
    };

    return runTests(testsPath, settings({
      output: false,
      custom_commands_path: [path.join(__dirname, '../../extra/commands')],
      globals
    }));
  });


});
