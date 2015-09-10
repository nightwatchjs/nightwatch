
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var mockery = require('mockery');

module.exports = {
  setUp: function(callback) {
    process.env['ENV_USERNAME'] = 'testuser';

    mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
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

    callback();
  },

  tearDown: function(callback) {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
    callback();
  },

  testRunWithMochaDefaults : function(test) {
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
      test.deepEqual(options, {ui: 'bdd'});
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
      readPaths : function(source, settings, cb) {
        cb(null, [
          'test1.js', 'test2.js'
        ]);
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH + '/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './withmocha.json',
      env : 'default'
    }).init();

    runner.runner(function(err, results) {
      test.equals(err, null);
      test.deepEqual(testFiles, ['test1.js', 'test2.js']);
      test.done();
    });
  },

  testRunWithMochaPerEnvironment : function(test) {
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
      test.deepEqual(options, {ui: 'bdd'});
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
      readPaths : function(source, settings, cb) {
        cb(null, [
          'test1.js', 'test2.js'
        ]);
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH + '/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './withmocha.json',
      env : 'mochatests'
    }).init();

    runner.runner(function(err, results) {
      test.equals(err, null);
      test.deepEqual(testFiles, ['test1.js', 'test2.js']);
      test.done();
    });
  },

  testRunWithMochaCustomOpts : function(test) {
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
      test.deepEqual(options, {ui: 'tdd'});
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
      readPaths : function(source, settings, cb) {
        cb(true, []);
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH + '/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './withmocha.json',
      env : 'default'
    }).init();

    runner.runner(function(err, results) {
      test.equals(err, true);
      test.deepEqual(results, []);
      test.done();
    });
  }
};
