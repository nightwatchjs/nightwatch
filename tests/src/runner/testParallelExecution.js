var BASE_PATH = process.env.NIGHTWATCH_COV
  ? 'lib-cov'
  : 'lib';
var util = require('util');
var events = require('events');
var mockery = require('mockery');
module.exports = {
  setUp: function(callback) {
    mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
    callback();
  },

  tearDown: function(callback) {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
    callback();
  },

  testParallelExecution : function(test) {
    var allArgs = [], allOpts = [];
    mockery.registerMock('child_process', {
      execFile : function(path, args, opts) {
        allArgs.push(args);
        allOpts.push(opts);

        function Stdout() {}
        function Stderr() {}

        util.inherits(Stdout, events.EventEmitter);
        util.inherits(Stderr, events.EventEmitter);

        var Child = function() {
          this.stdout = new Stdout();
          this.stderr = new Stderr();
          setTimeout(function() {
            this.emit('exit');
            this.emit('close');
          }.bind(this), 11);
        };

        util.inherits(Child, events.EventEmitter);
        return new Child();
      }
    });

    mockery.registerMock('../lib/runner/run.js', {
      run : function(source, settings, opts, callback) {}
    });

    var CliRunner = require('../../../' + BASE_PATH + '/../bin/_clirunner.js');
    var runner = new CliRunner({
      c : './extra/nightwatch.json',
      e : 'default,mixed'
    });

    runner.init(function() {
      test.ok(runner.isParallelMode());
      test.equals(allArgs.length, 2);
      test.equals(allArgs[0][2], 'default');
      test.equals(allArgs[1][2], 'mixed');
      test.done();
    });

    test.ok(runner.parallelMode);
  }
};
