var BASE_PATH = process.env.NIGHTWATCH_COV
  ? 'lib-cov'
  : 'lib';
var mockery = require('mockery');
module.exports = {
  setUp: function(callback) {
    process.env['ENV_USERNAME'] = 'testuser';

    mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
    mockery.registerMock('./_cli.js', {
      command : function(command) {
        return {
          isDefault : function() {
            return true;
          },
          defaults : function() {
            return './nightwatch.json'
          }
        }
      }
    });

    var config = {
      src_folders : ['tests'],
      test_settings : {
        'default' : {
          silent : true
        }
      }
    };

    mockery.registerMock('./nightwatch.json', config);
    mockery.registerMock('./empty.json', {
      src_folders : 'tests'
    });

    mockery.registerMock('./incorrect.json', {
      src_folders : 'tests',
      test_settings : {
        'default' : {
        }
      }
    });

    mockery.registerMock('./globals.json', {
      extra : {
        someGlobal : 'test'
      },
      otherGlobal : 'other-value'
    });

    mockery.registerMock('./settings.json', {
      src_folders : 'tests',
      test_settings : {
        'default' : {
          output : false,
          disable_colors: true
        }
      }
    });
    mockery.registerMock('./custom.json', {
      src_folders : ['tests'],
      selenium : {
        start_process : true
      },
      test_settings : {
        'default' : {
          output : false,
          disable_colors: true
        },
        'extra' : {
          username : '${ENV_USERNAME}',
          credentials : {
            service : {
              user : '${ENV_USERNAME}'
            }
          },

          selenium : {
            host : 'other.host'
          }
        }
      }
    });

    mockery.registerMock('path', {
      join : function(a, b) {
        if (b == './settings.json') {
          return './settings.json';
        }
        if (b == './custom.json') {
          return './custom.json';
        }
        if (b == './empty.json') {
          return './empty.json';
        }
        if (b == './incorrect.json') {
          return './incorrect.json';
        }
        if (b == 'demoTest') {
          return 'demoTest';
        }
        if (b == 'demoGroup') {
          return 'tests/demoGroup';
        }
        return './nightwatch.json';
      },
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

  testInitDefaults : function(test) {
    mockery.registerMock('fs', {
      existsSync : function(module) {
        if (module == './settings.json') {
          return false;
        }
        return true;
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH +'/../bin/_clirunner.js');
    var runner = new CliRunner({
      c : './nightwatch.json',
      e : 'default',
      o : 'output'
    }).init();

    test.deepEqual(runner.settings.src_folders, ['tests']);
    test.deepEqual(runner.settings.test_settings, {'default' : {
      silent: true,
      custom_commands_path: '',
      custom_assertions_path: '',
      output: true
    }});
    test.equals(runner.output_folder, 'output');
    test.equals(runner.parallelMode, false);
    test.equals(runner.manageSelenium, false);

    test.done();

  },

  testReadSettingsDeprecated : function(test) {
    mockery.registerMock('../lib/util/logger.js', {
      disableColors : function() {
        test.ok('disable colors called');
      }
    });

    mockery.registerMock('fs', {
      existsSync : function(module) {
        if (module == './settings.json') {
          return true;
        }
        return false;
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH +'/../bin/_clirunner.js');
    var runner = new CliRunner({
      c : './nightwatch.json',
      e : 'default',
      o : 'output',
      verbose : true,
      s : 'tobeskipped',
      f : 'tests*.js'
    }).init();

    test.expect(6);
    test.deepEqual(runner.settings.src_folders, ['tests']);
    test.deepEqual(runner.test_settings.skipgroup, ['tobeskipped']);
    test.equal(runner.test_settings.output, false);
    test.equal(runner.test_settings.silent, false);
    test.equal(runner.test_settings.filename_filter, 'tests*.js');
    test.done();

  },

  testCustomSettingsFileAndEnvironment : function(test) {
    mockery.registerMock('fs', {
      existsSync : function(module) {
        if (module == './custom.json') {
          return true;
        }
        return false;
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH +'/../bin/_clirunner.js');
    var runner = new CliRunner({
      c : './custom.json',
      e : 'extra'
    }).init();

    test.equal(runner.manageSelenium, true);
    test.equal(runner.settings.selenium.host, 'other.host');
    test.equal(runner.test_settings.output, false);
    test.equal(runner.test_settings.disable_colors, true);
    test.equal(runner.test_settings.username, 'testuser');
    test.equal(runner.test_settings.credentials.service.user, 'testuser');
    test.done();
  },

  testGetTestSourceSingle : function(test) {
    mockery.registerMock('fs', {
      existsSync : function(module) {
        if (module == './custom.json') {
          return true;
        }
        return false;
      },
      statSync : function(file) {
        if (file == 'demoTest.js') {
          test.ok('stat called');
          return true;
        }
        throw new Error('Start error.');
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH +'/../bin/_clirunner.js');
    var runner = new CliRunner({
      c : './custom.json',
      e : 'default',
      t : 'demoTest'
    }).init();

    var testSource = runner.getTestSource();
    test.expect(2);
    test.equal(testSource, 'demoTest.js');
    test.done();
  },

  testGetTestSourceGroup : function(test) {
    mockery.registerMock('fs', {
      existsSync : function(module) {
        if (module == './custom.json') {
          return true;
        }
        return false;
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH +'/../bin/_clirunner.js');
    var runner = new CliRunner({
      c : './custom.json',
      e : 'default',
      g : 'demoGroup'
    }).init();

    var testSource = runner.getTestSource();
    test.deepEqual(testSource, ['tests/demoGroup']);

    var otherRunner = new CliRunner({
      c : './custom.json',
      e : 'default',
      g : 'tests/demoGroup'
    }).init();

    testSource = otherRunner.getTestSource();
    test.deepEqual(testSource, ['tests/demoGroup']);

    var simpleRunner = new CliRunner({
      c : './custom.json',
      e : 'default'
    }).init();

    testSource = simpleRunner.getTestSource();
    test.deepEqual(testSource, ['tests']);

    test.done();
  },

  testParseTestSettingsInvalid : function(test) {
    mockery.registerMock('fs', {
      existsSync : function(module) {
        if (module == './empty.json') {
          return true;
        }
        return false;
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH +'/../bin/_clirunner.js');
    test.throws(function() {
      new CliRunner({
        c : './empty.json',
        e : 'default'
      }).init();
    }, 'No testing environment specified.');

    test.done();
  },

  testParseTestSettingsIncorrect : function(test) {
    mockery.registerMock('fs', {
      existsSync : function(module) {
        return module == './incorrect.json';
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH +'/../bin/_clirunner.js');
    test.throws(function() {
      new CliRunner({
        c : './incorrect.json',
        e : 'incorrect'
      }).init();
    }, 'Invalid testing environment specified: incorrect');

    test.done();
  },

  testReadExternalGlobals : function(test) {
    mockery.registerMock('fs', {
      existsSync : function(module) {
        if (module == './custom.json' || module == './globals.json') {
          return true;
        }
        return false;
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH +'/../bin/_clirunner.js');
    var runner = new CliRunner({
      c : './custom.json',
      e : 'extra'
    }).init();

    runner.settings.globals_path = './globals.json';
    runner.readExternalGlobals();

    test.equals(runner.test_settings.globals.otherGlobal, 'other-value');
    test.equals(runner.test_settings.globals.someGlobal, 'test');


    test.throws(function() {
      var runner = new CliRunner({
        c : './custom.json',
        e : 'extra'
      }).init();
      runner.settings.globals_path = './incorrect.json';
      runner.readExternalGlobals();

    }, 'External global file could not be located - using ./incorrect.json.');

    test.done();
  },

  testStartSeleniumDisabled : function(test) {
    var CliRunner = require('../../../'+ BASE_PATH +'/../bin/_clirunner.js');
    var runner = new CliRunner({
      c : './nightwatch.json',
      e : 'default'
    }).init();

    runner.manageSelenium = false;
    test.expect(1);
    runner.startSelenium(function() {
      test.ok('callback called');
      test.done();
    });
  },

  testStartSeleniumEnabled : function(test) {
    mockery.registerMock('../lib/runner/selenium.js', {
      startServer : function(settings, cb) {
        cb({}, null, 'Server already running.');
      }
    });
    var CliRunner = require('../../../'+ BASE_PATH +'/../bin/_clirunner.js');
    var runner = new CliRunner({
      c : './nightwatch.json',
      e : 'default'
    }).init();

    runner.manageSelenium = true;
    runner.parallelMode = true;
    test.expect(2);
    
    runner.globalErrorHandler = function(err) {
      test.equals(err.message, 'Server already running.');
      test.equals(runner.settings.parallelMode, true);
      test.done();
    };

    runner.startSelenium();
  }
};
