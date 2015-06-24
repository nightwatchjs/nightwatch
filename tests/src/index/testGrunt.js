var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var mockery = require('mockery');
var Nightwatch = require('../../../lib/index.js');
var path = require('path');

module.exports = {
  setUp : function(cb) {
    mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
    this.cwd = process.cwd();
    cb();
  },

  tearDown : function(callback) {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
    process.cwd(this.cwd);
    process.chdir(this.cwd);
    callback();
  },

  testRunGruntDefaults : function(test) {
    test.expect(3);

    mockery.registerMock('./runner/cli/cli.js', {
      setup : function() {
        return this;
      },
      init : function() {
        return {
        };
      }
    });

    mockery.registerMock('./runner/cli/clirunner.js', function() {
      this.setup = function(settings, done) {
        test.deepEqual(settings, {
          silent:true
        });
        return this;
      };
      this.updateTestSettings = function(settings) {
        return this;
      };
      this.runTests = function(done) {
        done();
        return this;
      };
    });


    var grunt = {
      async : function() {
        return function() {
          test.ok('Done callback called');
        };
      },
      data : {
        settings : {
          silent : true
        },
        argv : {
          group : 'testgroup'
        }
      },
      options : function() {
        return {
          cwd : './src'
        };
      },
      registerMultiTask : function(task, descr, cb) {
        cb.call(this);

        var lastFolder = process.cwd().split(path.sep).pop();
        test.equals(lastFolder, 'src');
        test.done();
      }
    };

    Nightwatch.initGrunt(grunt);
  },

  testRunGruntParallelMode : function(test) {
    test.expect(4);

    mockery.registerMock('./runner/cli/cli.js', {
      setup : function() {
        return this;
      },
      init : function() {
        return {
          'parallel-mode' : true
        };
      }
    });

    mockery.registerMock('./runner/cli/clirunner.js', function(argv) {

      test.ok(argv['parallel-mode']);
      test.ok(!('env' in argv));
      test.equals(argv.test.substr(-34), '/tests/sampletests/async/sample.js');

      this.setup = function() {
        return this;
      };
      this.updateTestSettings = function(settings) {
        return this;
      };
      this.runTests = function(done) {
        done();
        return this;
      };
    });


    var grunt = {
      async : function() {
        return function() {
          test.ok('Done callback called');
        };
      },
      data : {
        argv : {
          env : 'env1,env2',
          test : './sampletests/async/sample.js'
        }
      },
      options : function() {
        return {};
      },
      registerMultiTask : function(task, descr, cb) {
        cb.call(this);

        test.done();
      }
    };

    Nightwatch.initGrunt(grunt);
  }
};