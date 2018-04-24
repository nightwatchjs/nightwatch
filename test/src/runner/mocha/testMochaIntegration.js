const common = require('../../../common.js');
const path = require('path');
const assert = require('assert');
const Globals = require('../../../lib/globals/commands.js');
const CliRunner = common.require('runner/cli/cli.js');

const originalExit = process.exit;

describe('test Mocha integration', function() {
  beforeEach(function(done) {
    Globals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.exit = originalExit;
    Globals.afterEach.call(this, done);
  });

  it('testRunMochaSampleTests', function(done) {
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/withmocha.json'),
      env: 'default',
      verbose: false
    }).init();

    runner.envSettings.globals.test_calls = 0;

    process.exit = function(code) {
      assert.equal(runner.envSettings.globals.test_calls, 12);
      assert.equal(code, 10);
      done();
    };

    let mocha = runner.runner(function(err, results) {
      assert.equal(err, null);
      assert.equal(results.failed, 2);
    });

    assert.equal(mocha.options.ui, 'bdd');

  });
});
