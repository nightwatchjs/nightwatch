const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

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
    Object.keys(require.cache).forEach(function(module) {
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
    }, false, true);

    let testsPath = path.join(__dirname, '../../sampletests/withservererrors');
    let globals = {
      calls: 0,
      retryAssertionTimeout: 150,
      waitForConditionTimeout: 150,
      waitForConditionPollInterval: 50,
      reporter(results, cb) {
        assert.deepEqual(results.errmessages, []);
        assert.strictEqual(results.passed, 2);
        assert.strictEqual(results.failed, 2);
        assert.strictEqual(results.assertions, 4);
        assert.strictEqual(results.errors, 0);
        assert.strictEqual(results.skipped, 0);
        const {completed} = results.modules.sampleTestWithServerError;
        assert.ok(completed.demoTest.lastError.message.includes(`Server Error: An unknown error has occurred – 

502 Bad Gateway`));

        cb();
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      skip_testcases_on_fail: false,
      output: false,
      report_command_errors: true,
      silent: false,
      persist_globals: true,
      disable_error_log: 0,
      globals,
      output_folder: false
    };

    return NightwatchClient.runTests({
      _source: [testsPath]
    }, settings);
  });

});
