var common = require('../../../common.js');
var mockery = require('mockery');
var assert = require('assert');

module.exports = {
  'test CLI Runner Mocha' : {
    beforeEach: function() {
      process.env['ENV_USERNAME'] = 'testuser';

      mockery.enable({ useCleanCache: true, warnOnReplace : false, warnOnUnregistered: false });
      mockery.registerMock('./cli.js', {
        command : function(command) {
          return {
            isDefault : function() {
              return false;
            },
            defaults : function() {
              return './nightwatch.json';
            }
          };
        }
      });
      mockery.registerMock('path', {
        resolve : function(a) {
          return a;
        }
      });

    },

    afterEach: function() {
      mockery.deregisterAll();
      mockery.resetCache();
      mockery.disable();
    },

    testRunWithMochaDefaults : function(done) {
      var testFiles = [];

      mockery.registerMock('./withmocha.json', {
        src_folders : ['tests'],
        output_folder : false,
        test_settings : {
          'default' : {
            silent : true
          }
        },
        test_runner : 'mocha'
      });

      function Mocha(options) {
        assert.deepEqual(options, {ui: 'bdd'});
      }
      Mocha.prototype = {
        addFile : function(file) {
          testFiles.push(file);
        },
        run : function(nightwatch, opts, cb) {
          cb(false);
        }
      };
      mockery.registerMock('mocha-nightwatch', Mocha);
      mockery.registerMock('../run.js', {
        setFinishCallback : function(cb) {},
        readPaths : function(source, settings, cb) {
          cb(null, [
            'test1.js', 'test2.js'
          ]);
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './withmocha.json',
        env : 'default'
      }).init();

      runner.runner(function(err, results) {
        assert.equal(err, null);
        assert.deepEqual(testFiles, ['test1.js', 'test2.js']);
        done();
      });
    },

    testRunWithMochaPerEnvironment : function(done) {
      var testFiles = [];

      mockery.registerMock('./withmocha.json', {
        src_folders : ['tests'],
        output_folder : false,
        test_settings : {
          'default' : {
            silent : true
          },
          mochatests : {
            test_runner : 'mocha'
          }
        },
        test_runner : 'default'
      });

      function Mocha(options) {
        assert.deepEqual(options, {ui: 'bdd'});
      }
      Mocha.prototype = {
        addFile : function(file) {
          testFiles.push(file);
        },
        run : function(nightwatch, opts, cb) {
          cb(false);
        }
      };
      mockery.registerMock('mocha-nightwatch', Mocha);
      mockery.registerMock('../run.js', {
        setFinishCallback : function() {},
        readPaths : function(source, settings, cb) {
          cb(null, [
            'test1.js', 'test2.js'
          ]);
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './withmocha.json',
        env : 'mochatests'
      }).init();

      runner.runner(function(err, results) {
        assert.equal(err, null);
        assert.deepEqual(testFiles, ['test1.js', 'test2.js']);
        done();
      });
    },

    testRunWithMochaCustomOpts : function(done) {
      var testFiles = [];

      mockery.registerMock('./withmocha.json', {
        src_folders : ['tests'],
        output_folder : false,
        test_settings : {
          'default' : {
            silent : true
          }
        },
        test_runner : {
          type : 'mocha',
          options : {
            ui : 'tdd'
          }
        }
      });

      function Mocha(options) {
        assert.deepEqual(options, {ui: 'tdd'});
      }
      Mocha.prototype = {
        addFile : function(file) {
          testFiles.push(file);
        },
        run : function(nightwatch, opts, cb) {
          cb(false);
        }
      };
      mockery.registerMock('mocha-nightwatch', Mocha);
      mockery.registerMock('../run.js', {
        setFinishCallback : function() {},
        readPaths : function(source, settings, cb) {
          cb(true, []);
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './withmocha.json',
        env : 'default'
      }).init();

      runner.runner(function(err, results) {
        assert.equal(err, true);
        assert.deepEqual(results, []);
        done();
      });
    }
  }
};
