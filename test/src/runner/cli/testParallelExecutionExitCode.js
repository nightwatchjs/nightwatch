const util = require('util');
const events = require('events');
const mockery = require('mockery');
const path = require('path');
const assert = require('assert');
const common = require('../../../common.js');

describe('test Parallel Execution Exit Code', function() {

  beforeEach(function() {
    this.allArgs = [];
    this.allOpts = [];
    let self = this;
    let index = 0;
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mockery.registerMock('child_process', {
      spawn: function(path, args, opts) {
        self.allArgs.push(args);
        self.allOpts.push(opts);

        function Stdout() {
        }

        function Stderr() {
        }

        util.inherits(Stdout, events.EventEmitter);
        util.inherits(Stderr, events.EventEmitter);

        let Child = function() {
          this.stdout = new Stdout();
          this.stderr = new Stderr();
          setTimeout(function() {
            this.emit('close');
            this.emit('exit', index == 0 ? 1 : 0);
          }.bind(this), 11);
        };

        util.inherits(Child, events.EventEmitter);
        return new Child();
      }
    });

    mockery.registerMock('../lib/runner/run.js', {
      run: function(source, settings, opts, callback) {
      }
    });
    mockery.registerMock('os', {
      cpus: function() {
        return [0, 1, 2];
      }
    });
  })

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
    process.env.__NIGHTWATCH_PARALLEL_MODE = null;
  });

  it('testParallelExecutionWithCodeNonZeroWorkers', function(done) {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism-count.json')
    });

    let originalExit = process.exit;
    process.exit = function(code) {
      assert.equal(code, 1);
      process.exit = originalExit;
      done();
    };

    runner.setup({}, function(output, code) {
      assert.equal(code, 1);
    });
  });

  it('testParallelExecutionWithCodeNonZeroEnvs', function(done) {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism-envs.json'),
      env: 'env1,env2'
    });

    let originalExit = process.exit;
    process.exit = function(code) {
      assert.equal(code, 1);
      process.exit = originalExit;
      done();
    };

    runner.setup({}, function(output, code) {
      assert.equal(code, 1);
    });
  });
});
