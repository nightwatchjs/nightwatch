var BASE_PATH = process.env.NIGHTWATCH_COV
  ? 'lib-cov'
  : 'lib';
var util = require('util');
var events = require('events');
var mockery = require('mockery');
module.exports = {
  setUp: function(callback) {
    mockery.enable({ useCleanCache: true, warnOnUnregistered: true });
    callback();
  },

  tearDown: function(callback) {
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
        };

        util.inherits(Child, events.EventEmitter);
        return new Child();
      }
    });

    mockery.registerMock('../lib/runner/run.js', {
      run : function(source, settings, opts, callback) {
        console.log('Run', source, settings)
        //callback();
      }
    });

    var CliRunner = require('../../../' + BASE_PATH + '/../bin/_clirunner.js');
    var runner = new CliRunner({
      c : './extra/nightwatch.json',
      e : 'default,mixed'
    }).init();

    runner.runTests(function() {
      console.log(allArgs);
      console.log(allOpts);
      test.done();
    });
  }
};
