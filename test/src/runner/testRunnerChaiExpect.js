const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const Settings = common.require('settings/settings.js');

describe('testRunnerChaiExpect', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('testRunWithChaiExpect', function(done) {
    const testsPath = path.join(__dirname, '../../sampletests/withchaiexpect');
    const Runner = common.require('runner/runner.js');

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: false,
      silent: true,
      output: false,
      globals: {test: assert}
    });

    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.equal(runner.results.modules.sampleWithChai.tests, 2);
        assert.equal(runner.results.modules.sampleWithChai.failures, 0);
      });
  });
});
