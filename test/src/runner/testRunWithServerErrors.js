const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunWithServerErrors', function() {

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

  afterEach(function() {
    Object.keys(require.cache).filter(i => i.includes('/sampletests')).forEach(function(module) {
      delete require.cache[module];
    });
  });

  it('testRunner with 502 server errors', function() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      postdata: {
        using: 'css selector',
        value: '#element-server-error'
      },
      statusCode: 502,
      contentType: 'text/html',
      response: '<html>\n<head>\n<title>502 Bad Gateway</title>\n</head>\n<body>\n</body></html>'
    });

    let testsPath = path.join(__dirname, '../../sampletests/withservererrors');
    let globals = {
      calls: 0,
      retryAssertionTimeout: 150,
      waitForConditionTimeout: 150,
      waitForConditionPollInterval: 50,
      reporter(results, cb) {
        assert.strictEqual(results.errmessages.length, 4);
        assert.strictEqual(results.passed, 0);
        assert.strictEqual(results.failed, 3);
        assert.strictEqual(results.assertions, 3);
        assert.strictEqual(results.errors, 4);
        assert.strictEqual(results.skipped, 0);
        const {completed} = results.modules.sampleTestWithServerError;
        assert.ok(completed.demoTest.lastError.message.includes('502 Bad Gateway'), `Result: ${completed.demoTest.lastError.message}`);

        cb();
      }
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      output: false,
      skip_testcases_on_fail: false,
      report_command_errors: true,
      disable_error_log: 0,
      globals
    }));
  });

});
