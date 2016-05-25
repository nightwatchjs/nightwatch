var util = require('util');
var events = require('events');
var mockery = require('mockery');
var path = require('path');
var assert = require('assert');
var common = require('../../../common.js');

module.exports = {
  'test Parallel Execution Exit Code' : {
    beforeEach: function () {
      this.allArgs = [];
      this.allOpts = [];
      var self = this;
      var index = 0;
      mockery.enable({useCleanCache: true, warnOnUnregistered: false});
      mockery.registerMock('child_process', {
        spawn: function (path, args, opts) {
          self.allArgs.push(args);
          self.allOpts.push(opts);

          function Stdout() {
          }

          function Stderr() {
          }

          util.inherits(Stdout, events.EventEmitter);
          util.inherits(Stderr, events.EventEmitter);

          var Child = function () {
            this.stdout = new Stdout();
            this.stderr = new Stderr();
            setTimeout(function () {
              this.emit('close');
              this.emit('exit', index == 0 ? 1 : 0);
            }.bind(this), 11);
          };

          util.inherits(Child, events.EventEmitter);
          return new Child();
        }
      });

      mockery.registerMock('../lib/runner/run.js', {
        run: function (source, settings, opts, callback) {
        }
      });
      mockery.registerMock('os', {
        cpus: function () {
          return [0, 1, 2];
        }
      });
    },

    afterEach: function () {
      mockery.deregisterAll();
      mockery.resetCache();
      mockery.disable();
      process.env.__NIGHTWATCH_PARALLEL_MODE = null;
    },

    testParallelExecutionWithCodeNonZeroWorkers: function (done) {
      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config: path.join(__dirname, '../../../extra/parallelism-count.json')
      });

      var originalExit = process.exit;
      process.exit = function (code) {
        assert.equal(code, 1);
        process.exit = originalExit;
        done();
      };

      runner.setup({}, function (output, code) {
        assert.equal(code, 1);
      });
    },

    testParallelExecutionWithCodeNonZeroEnvs: function (done) {
      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config: path.join(__dirname, '../../../extra/parallelism-envs.json'),
        env: 'env1,env2'
      });

      var originalExit = process.exit;
      process.exit = function (code) {
        assert.equal(code, 1);
        process.exit = originalExit;
        done();
      };

      runner.setup({}, function (output, code) {
        assert.equal(code, 1);
      });
    }
  }
};
