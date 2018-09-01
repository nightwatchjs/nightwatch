const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const Settings = common.require('settings/settings.js');
const Globals = require('../../lib/globals.js');

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
    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      globals: {
        test: assert,
        reporter() {}
      },
      output_folder: false,
      silent: true,
      output: false
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.equal(runner.results.modules.sampleWithChai.tests, 2);
        assert.equal(runner.results.modules.sampleWithChai.failures, 0);
      });
  });
});
