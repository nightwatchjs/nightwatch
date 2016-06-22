var common = require('../../common.js');
var mockery = require('mockery');

var Nightwatch = common.require('index.js');
var path = require('path');
var assert = require('assert');

module.exports = {
  'test Grunt' : {
    beforeEach : function() {
      mockery.enable({
        useCleanCache: true, warnOnUnregistered: false
      });
      this.cwd = process.cwd();
    },

    afterEach : function() {
      mockery.deregisterAll();
      mockery.resetCache();
      mockery.disable();
      process.cwd(this.cwd);
      process.chdir(this.cwd);
    },

    testRunGruntDefaults : function(done) {
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
          assert.deepEqual(settings, {
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
            assert.ok('Done callback called');
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
            cwd : path.join(__dirname, '../')
          };
        },
        registerMultiTask : function(task, descr, cb) {
          cb.call(this);

          var lastFolder = process.cwd().split(path.sep).pop();
          assert.equal(lastFolder, 'src');
          done();
        }
      };
      Nightwatch.initGrunt(grunt);
    },

    testRunCliTestSource : function(done) {
      mockery.registerMock('./runner/cli/cli.js', {
        setup : function() {
          return this;
        },
        init : function() {
          return {
            _ : ['nightwatch'],
            '$0': 'grunt',
            env: 'default',
            e: 'default',
            filter: '',
            f: '',
            tag: '',
            a: ''
          };
        }
      });

      Nightwatch.cli(function(argv) {
        assert.ok('_' in argv);
        assert.deepEqual(argv['_'], ['nightwatch']);
        assert.strictEqual(argv._source, undefined);
        done();
      });
    },

    testRunGruntParallelMode : function(done) {
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

        assert.ok(argv['parallel-mode']);
        assert.ok(!('env' in argv));
        assert.equal(argv.test.substr(-33), '/test/sampletests/async/sample.js');

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
            assert.ok('Done callback called');
          };
        },
        data : {
          argv : {
            env : 'env1,env2',
            test : path.join(__dirname, '../../sampletests/async/sample.js')
          }
        },
        options : function() {
          return {};
        },
        registerMultiTask : function(task, descr, cb) {
          cb.call(this);

          done();
        }
      };

      Nightwatch.initGrunt(grunt);
    }
  }
};