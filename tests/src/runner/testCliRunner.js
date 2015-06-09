
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
            return true;
          },
          defaults : function() {
            return './nightwatch.json';
          }
        };
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
    mockery.registerMock('./nightwatch.conf.js', config);

    mockery.registerMock('./output_disabled.json', {
      src_folders : ['tests'],
      output_folder : false,
      test_settings : {
        'default' : {
          silent : true
        }
      }
    });

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
    mockery.registerMock('./sauce.json', {
      src_folders : 'tests',
      selenium : {
        start_process: true
      },
      end_session_on_fail : true,
      test_settings : {
        'default' : {
        },
        'saucelabs' : {
          selenium : {
            start_process : false,
            start_session : false
          }
        }
      }
    });
    mockery.registerMock('./selenium_override.json', {
      src_folders : 'tests',
      selenium : {
        start_process: false,
        start_session: false
      },
      test_settings : {
        'default' : {
          selenium : {
            start_process : true,
            start_session : true
          }
        }
      }
    });
    mockery.registerMock('./custom.json', {
      src_folders : ['tests'],
      selenium : {
        start_process : true
      },
      end_session_on_fail : true,
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
          end_session_on_fail : false,

          selenium : {
            host : 'other.host'
          },

          cli_args : {
            arg1 : 'arg1_value',
            arg2 : 'arg2_value'
          },

          desiredCapabilities : {
            'test.user' : '${ENV_USERNAME}'
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
        if (b == './output_disabled.json') {
          return './output_disabled.json';
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
        if (b == './sauce.json') {
          return './sauce.json';
        }
        if (b == './selenium_override.json') {
          return './selenium_override.json';
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

    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './nightwatch.json',
      env : 'default',
      output : 'output',
      skiptags : 'home,arctic',
      tag : 'danger'
    }).init();

    test.deepEqual(runner.settings.src_folders, ['tests']);
    test.deepEqual(runner.settings.test_settings, {'default' : {
      silent: true,
      custom_commands_path: '',
      custom_assertions_path: '',
      page_objects_path: '',
      output: true,
      tag_filter: 'danger',
      skiptags: [ 'home', 'arctic' ]
    }});

    test.equals(runner.output_folder, 'output');
    test.equals(runner.parallelMode, false);
    test.equals(runner.manageSelenium, false);
    test.equals(runner.startSession, true);

    test.done();

  },

  testSetOutputFolder : function(test) {
    mockery.registerMock('fs', {
      existsSync : function(module) {
        if (module == './settings.json' || module == './nightwatch.conf.js') {
          return false;
        }

        return true;
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './output_disabled.json',
      env : 'default'
    }).init();

    test.equals(runner.output_folder, false);

    test.done();

  },

  testReadSettingsDeprecated : function(test) {
    mockery.registerMock('../../util/logger.js', {
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

    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './nightwatch.json',
      env : 'default',
      output : 'output',
      verbose : true,
      skipgroup : 'tobeskipped',
      filter : 'tests*.js'
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

    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './custom.json',
      env : 'extra'
    }).init();

    test.equal(runner.manageSelenium, true);
    test.equal(runner.startSession, true);
    test.equal(runner.endSessionOnFail, false);
    test.deepEqual(runner.settings.selenium.cli_args, {arg1: 'arg1_value', arg2: 'arg2_value'});

    test.equal(runner.settings.selenium.host, 'other.host');
    test.equal(runner.test_settings.output, false);
    test.equal(runner.test_settings.disable_colors, true);
    test.equal(runner.test_settings.username, 'testuser');
    test.equal(runner.test_settings.credentials.service.user, 'testuser');
    test.equal(runner.test_settings.desiredCapabilities['test.user'], 'testuser');
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

    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './custom.json',
      env : 'default',
      test : 'demoTest'
    }).init();

    var testSource = runner.getTestSource();
    test.expect(2);
    test.equal(testSource, 'demoTest.js');
    test.done();
  },

  testRunTestsWithTestcaseOption : function(test) {
    mockery.registerMock('fs', {
      existsSync : function(module) {
        if (module == './custom.json') {
          return true;
        }
        return false;
      },
      statSync : function(file) {
        if (file == 'demoTest.js') {
          return true;
        }
        throw new Error('Start error.');
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './custom.json',
      env : 'default',
      test : 'demoTest',
      testcase : 'testCase'
    }).init();

    var testSource = runner.getTestSource();
    test.equal(runner.argv.testcase, 'testCase');
    test.done();
  },

  testRunTestsWithTestcaseOptionAndWithoutTest : function(test) {
    mockery.registerMock('fs', {
      existsSync : function(module) {
        if (module == './custom.json') {
          return true;
        }
        return false;
      },
      statSync : function(file) {
        if (file == 'demoTest.js') {
          return true;
        }
        throw new Error('Start error.');
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './custom.json',
      env : 'default',
      testcase : 'testCase'
    }).init();

    var testSource = runner.getTestSource();
    test.equal(runner.argv.testcase, null);
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

    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './custom.json',
      env : 'default',
      group : 'demoGroup'
    }).init();

    var testSource = runner.getTestSource();
    test.deepEqual(testSource, ['tests/demoGroup']);

    var otherRunner = new CliRunner({
      config : './custom.json',
      env : 'default',
      group : 'tests/demoGroup'
    }).init();

    testSource = otherRunner.getTestSource();
    test.deepEqual(testSource, ['tests/demoGroup']);

    var simpleRunner = new CliRunner({
      config : './custom.json',
      env : 'default'
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

    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    test.throws(function() {
      new CliRunner({
        config : './empty.json',
        env : 'default'
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

    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    test.throws(function() {
      new CliRunner({
        config : './incorrect.json',
        env : 'incorrect'
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

    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './custom.json',
      env : 'extra'
    }).init();

    runner.settings.globals_path = './globals.json';
    runner.readExternalGlobals();

    test.equals(runner.test_settings.globals.otherGlobal, 'other-value');
    test.equals(runner.test_settings.globals.someGlobal, 'test');


    test.throws(function() {
      var runner = new CliRunner({
        config : './custom.json',
        env : 'extra'
      }).init();
      runner.settings.globals_path = './incorrect.json';
      runner.readExternalGlobals();

    }, 'External global file could not be located - using ./incorrect.json.');

    test.done();
  },

  testStartSeleniumDisabled : function(test) {
    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './nightwatch.json',
      env : 'default'
    }).init();

    runner.manageSelenium = false;
    test.expect(1);
    runner.startSelenium(function() {
      test.ok('callback called');
      test.done();
    });
  },

  testStartSeleniumDisabledPerEnvironment : function(test) {
    mockery.registerMock('fs', {
      existsSync : function(module) {
        if (module == './sauce.json') {
          return true;
        }
        return false;
      }
    });
    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './sauce.json',
      env : 'saucelabs'
    }).init();

    test.equal(runner.manageSelenium, false);
    test.equal(runner.startSession, false);
    test.equal(runner.endSessionOnFail, true);
    test.done();
  },

  testStartSeleniumEnvironmentOverride : function(test) {
    mockery.registerMock('fs', {
      existsSync : function(module) {
        if (module == './selenium_override.json') {
          return true;
        }
        return false;
      }
    });
    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './selenium_override.json',
      env : 'default'
    }).init();

    test.equal(runner.manageSelenium, true);
    test.equal(runner.startSession, true);
    test.done();
  },

  testStartSeleniuSession : function(test) {
    var CliRunner = require('../../../'+ BASE_PATH +'/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './nightwatch.json',
      env : 'default'
    }).init();

    runner.manageSelenium = false;
    test.expect(1);
    runner.startSelenium(function() {
      test.ok('callback called');
      test.done();
    });
  },

  testStartSeleniumEnabled : function(test) {
    mockery.registerMock('../selenium.js', {
      startServer : function(settings, cb) {
        cb({}, null, 'Server already running.');
      }
    });
    mockery.registerMock('./errorhandler.js', {
      handle : function(err) {
        test.equals(err.message, 'Server already running.');
        test.equals(runner.settings.parallelMode, true);
        test.done();
      }
    });

    var CliRunner = require('../../../'+ BASE_PATH + '/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './nightwatch.json',
      env : 'default'
    }).init();

    runner.manageSelenium = true;
    runner.parallelMode = true;
    test.expect(2);

    runner.startSelenium();
  }
};
