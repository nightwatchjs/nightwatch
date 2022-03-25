const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');

describe('testRunnerChaiExpect', function() {
  before(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('testRunWithChaiExpect', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withchaiexpect');
    const Settings = common.require('settings/settings.js');
    const settings = Settings.parse({
      selenium: {
        port: 10195,
        host: 'localhost',
        start_process: false
      },
      globals: {
        test: assert,
        reporter() {

        }
      },
      output: false,
      tag_filter: null,
      silent: false,
      output: false
    });

    const Globals = require('../../lib/globals.js');

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.strictEqual(runner.results.modules.sampleWithChai.tests, 2);
        assert.strictEqual(runner.results.modules.sampleWithChai.failures, 0);
      });
  });
});
