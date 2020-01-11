const common = require('../../../common.js');
const path = require('path');
const assert = require('assert');
const Globals = require('../../../lib/globals/commands.js');
const MockServer = require('../../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

describe('test Mocha integration', function() {
  const originalExit = process.exit;

  before(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function(done) {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.exit = originalExit;
    Globals.afterEach.call(this, done);
  });

  it('testRunMochaSampleTests', function() {
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      persist_globals: true,
      globals: {
        test_calls: 0,
        retryAssertionTimeout: 0
      },
      output: false,
      silent: false,
      output_folder: false
    };

    let error;

    return NightwatchClient.runTests({
      config: path.join(__dirname, '../../../extra/withmocha.json'),
      env: 'default',
      _source: []
    }, settings).catch(err => {
      error = err;
    }).then(() => {
      assert.equal(settings.globals.test_calls, 12);
      assert.ok(error.message.includes('Mocha reported test failures.'), error);
    })
  });
});
