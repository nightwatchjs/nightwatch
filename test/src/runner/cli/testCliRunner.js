var common = require('../../../common.js');
var mockery = require('mockery');
var assert = require('assert');

module.exports = {
  'Test CLI Runner' : {
    testInitDefaults : function() {
      mockery.registerMock('fs', {
        statSync : function(module) {
          if (module == './settings.json') {
            throw new Error('Does not exist');
          }
          return {isFile : function() {return true}};
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './nightwatch.json',
        env : 'default',
        output : 'output',
        skiptags : 'home,arctic',
        tag : 'danger'
      }).init();

      assert.deepEqual(runner.settings.src_folders, ['tests']);
      assert.deepEqual(runner.settings.test_settings, {'default' : {
        silent: true,
        custom_commands_path: '',
        custom_assertions_path: '',
        page_objects_path: '',
        output: true,
        tag_filter: 'danger',
        skiptags: [ 'home', 'arctic' ]
      }});

      assert.equal(runner.output_folder, 'output');
      assert.equal(runner.parallelMode, false);
      assert.equal(runner.manageSelenium, false);
      assert.equal(runner.startSession, true);
    },

    testSetOutputFolder : function() {
      mockery.registerMock('fs', {
        statSync : function(module) {
          if (module == './settings.json' || module == './nightwatch.conf.js') {
            throw new Error('Does not exist');
          }
          return {isFile : function() {return true}};
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './output_disabled.json',
        env : 'default'
      }).init();

      assert.equal(runner.output_folder, false);
    },

    testReadSettingsDeprecated : function() {
      var disableColorsCalled = false;
      mockery.registerMock('../../util/logger.js', {
        disableColors : function() {
          disableColorsCalled = true;
        }
      });

      mockery.registerMock('fs', {
        statSync : function(module) {
          if (module == './settings.json') {
            return {isFile : function() {return true}};
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './nightwatch.json',
        env : 'default',
        output : 'output',
        verbose : true,
        skipgroup : 'tobeskipped',
        filter : 'tests*.js'
      }).init();

      assert.deepEqual(runner.settings.src_folders, ['tests']);
      assert.deepEqual(runner.test_settings.skipgroup, ['tobeskipped']);
      assert.equal(runner.test_settings.output, false);
      assert.equal(runner.test_settings.silent, false);
      assert.equal(runner.test_settings.filename_filter, 'tests*.js');
      assert.ok(disableColorsCalled, 'disable colors not called');
    },

    testCustomSettingsFileAndEnvironment : function() {
      mockery.registerMock('fs', {
        statSync : function(module) {
          if (module == './custom.json') {
            return {isFile : function() {return true}};
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './custom.json',
        env : 'extra'
      }).init();

      assert.equal(runner.manageSelenium, true);
      assert.equal(runner.startSession, true);
      assert.equal(runner.endSessionOnFail, false);
      assert.deepEqual(runner.settings.selenium.cli_args, {arg1: 'arg1_value', arg2: 'arg2_value'});

      assert.equal(runner.settings.selenium.host, 'other.host');
      assert.equal(runner.settings.detailed_output, false);
      assert.equal(runner.test_settings.output, false);
      assert.equal(runner.test_settings.disable_colors, true);
      assert.equal(runner.test_settings.username, 'testuser');
      assert.equal(runner.test_settings.credentials.service.user, 'testuser');
      assert.equal(runner.test_settings.desiredCapabilities['test.user'], 'testuser');
    },

    testGetTestSourceSingle : function() {
      var statSyncCalled = false;
      mockery.registerMock('fs', {
        statSync : function(file) {
          if (file == 'demoTest') {
            statSyncCalled = true;
            return {
              isFile : function() {
                return true;
              }
            };
          }
          if (file == 'demoTest.js' || file == './custom.js') {
            return {isFile : function() {return true}};
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './custom.json',
        env : 'default',
        test : 'demoTest'
      }).init();

      var testSource = runner.getTestSource();
      assert.equal(testSource, 'demoTest.js');
      assert.ok(statSyncCalled);
    },


    testGetTestSourceSingleWithAbsolutePath : function() {
      var ABSOLUTE_PATH = '/path/to/test';
      var ABSOLUTE_SRC_PATH = ABSOLUTE_PATH + ".js";
      var statSyncCalled = false;

      mockery.registerMock('fs', {
        statSync : function(file) {
          if (file == ABSOLUTE_PATH) {
            statSyncCalled = true;
            return {
              isFile : function() {
                return true;
              }
            };
          }
          if (file == ABSOLUTE_SRC_PATH || file == './custom.json') {
            return {isFile : function() {return true}};
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './custom.json',
        env : 'default',
        test : ABSOLUTE_PATH
      }).init();

      var testSource = runner.getTestSource();
      assert.equal(runner.settings.detailed_output, true);
      assert.equal(testSource, ABSOLUTE_SRC_PATH);
      assert.ok(statSyncCalled);
    },

    testGetTestSourceSingleWithRelativePath : function() {
      var RELATIVE_PATH = '../path/to/test';
      var TEST_SRC_PATH = process.cwd() + '/path/to/test.js';
      var statSyncCalled = false;

      mockery.registerMock('fs', {
        statSync : function(file) {
          if (file == RELATIVE_PATH) {
            statSyncCalled = true;
            return {
              isFile : function() {
                return true;
              }
            };
          }
          if (file == TEST_SRC_PATH || file == './custom.json') {
            return {isFile : function() {return true}};
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './custom.json',
        env : 'default',
        test : RELATIVE_PATH
      }).init();

      var testSource = runner.getTestSource();
      assert.equal(testSource, TEST_SRC_PATH);
      assert.ok(statSyncCalled);
    },

    testGetTestSourceAsSecondArgument : function() {
      mockery.registerMock('fs', {
        statSync : function(module) {
          if (module == 'test.js' || module == './custom.json') {
            return {
              isFile : function() {
                return true;
              }
            }
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './custom.json',
        env : 'default',
        _source : ['test.js']
      }).init();

      var testSource = runner.getTestSource();
      assert.deepEqual(testSource, 'test.js');
    },

    testRunTestsWithTestSourceSingleInvalid : function(done) {
      var invalidTestFile = 'doesnotexist.js';
      var errorMessage = 'ENOENT: no such file or directory, stat \'' + invalidTestFile + '\'';
      mockery.registerMock('fs', {
        existsSync : function(module) {
          if (module == './custom.json') {
            return true;
          }
          return false;
        },
        statSync : function(module) {
          if (module == invalidTestFile) {
            throw new Error(errorMessage);
          }
          throw new Error('Start error.');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './custom.json',
        env : 'default',
        test: invalidTestFile
      });

      runner.manageSelenium = true;

      try {
        runner.init();
      } catch (err) {
        assert.equal(err.message, errorMessage);
        done();
      }
    },

    testRunTestsWithTestcaseOption : function() {
      mockery.registerMock('fs', {
        statSync : function(file) {
          if (file == 'demoTest' || file == './custom.json') {
            return {
              isFile : function() {
                return true;
              }
            };
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './custom.json',
        env : 'default',
        test : 'demoTest',
        testcase : 'testCase'
      }).init();

      runner.getTestSource();
      assert.equal(runner.argv.testcase, 'testCase');
    },

    testRunTestsWithTestcaseOptionAndSingleTestSource : function() {
      mockery.registerMock('fs', {
        statSync : function(file) {
          if (file == 'demoTest.js' || file == './custom.json') {
            return {
              isFile : function() {
                return true;
              }
            };
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './custom.json',
        env : 'default',
        _source : ['demoTest.js'],
        testcase : 'testCase'
      }).init();

      var testSource = runner.getTestSource();
      assert.equal(runner.argv.testcase, 'testCase');
    },

    testRunTestsWithTestcaseOptionAndWithoutTest : function() {
      mockery.registerMock('fs', {
        statSync : function(file) {
          if (file == 'demoTest.js' || file == './custom.json') {
            return {isFile : function() {return true}};
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './custom.json',
        env : 'default',
        testcase : 'testCase'
      }).init();

      var testSource = runner.getTestSource();
      assert.equal(runner.argv.testcase, null);
    },

    testGetTestSourceGroup : function() {
      mockery.registerMock('fs', {
        statSync : function(module) {
          switch (module) {
            case './custom.json':
            case './multi_test_paths.json':
              return {isFile : function() {return true}};
            case 'tests/demoGroup':
              return {isDirectory : function() {return true}};
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './custom.json',
        env : 'default',
        group : 'demoGroup'
      }).init();

      var testSource = runner.getTestSource();
      assert.deepEqual(testSource, ['tests/demoGroup']);

      var otherRunner = new CliRunner({
        config : './custom.json',
        env : 'default',
        group : 'tests/demoGroup'
      }).init();

      testSource = otherRunner.getTestSource();
      assert.deepEqual(testSource, ['tests/demoGroup']);

      var simpleRunner = new CliRunner({
        config : './custom.json',
        env : 'default'
      }).init();

      testSource = simpleRunner.getTestSource();
      assert.deepEqual(testSource, ['tests']);

      var invalidGroupRunner = new CliRunner({
        config : './custom.json',
        env : 'default',
        group : 'group_doesnotexist'
      }).init();

      testSource = invalidGroupRunner.getTestSource();
      assert.deepEqual(testSource, ['tests/group_doesnotexist']);

      var invalidGroupInMultiSrcRunner = new CliRunner({
        config : './multi_test_paths.json',
        env : 'default',
        group : 'group_doesnotexist'
      }).init();

      testSource = invalidGroupInMultiSrcRunner.getTestSource();
      assert.deepEqual(testSource, []);
    },

    testGetTestSourceMultipleGroups : function() {
      mockery.registerMock('fs', {
        statSync : function(module) {
          switch (module) {
            case './custom.json':
            case './multi_test_paths.json':
              return {isFile : function() {return true}};
            case 'tests/demoGroup1':
            case 'tests/demoGroup2':
            case 'tests1/demoGroup1':
            case 'tests1/demoGroup2':
            // no tests2/demoGroup1
            case 'tests2/demoGroup2':
              return {isDirectory : function() {return true}};
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './custom.json',
        env : 'default',
        group : 'demoGroup1,demoGroup2'
      }).init();

      var testSource = runner.getTestSource();
      assert.deepEqual(testSource, ['tests/demoGroup1', 'tests/demoGroup2']);

      var invalidGroupRunner = new CliRunner({
        config : './custom.json',
        env : 'default',
        group : 'demoGroup1,demoGroup2,group_doesnotexist'
      }).init();

      testSource = invalidGroupRunner.getTestSource();
      assert.deepEqual(testSource, ['tests/demoGroup1', 'tests/demoGroup2', 'tests/group_doesnotexist']);

      var stripMissingInMultiRunner = new CliRunner({
        config : './multi_test_paths.json',
        env : 'default',
        group : 'demoGroup1,demoGroup2,group_doesnotexist'
      }).init();

      testSource = stripMissingInMultiRunner.getTestSource();
      assert.deepEqual(testSource, ['tests1/demoGroup1', 'tests1/demoGroup2', 'tests2/demoGroup2']);
    },

    testParseTestSettingsInvalid : function() {
      mockery.registerMock('fs', {
        statSync : function(module) {
          if (module == './empty.json') {
            return {isFile : function() {return true}};
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      assert.throws(function() {
        new CliRunner({
          config : './empty.json',
          env : 'default'
        }).init();
      }, 'No testing environment specified.');
    },

    testParseTestSettingsNull : function() {
      mockery.registerMock('fs', {
        statSync : function(module) {
          if (module == './null.json') {
            return {isFile : function() {return true;}};
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');

      var runner = new CliRunner({
        config : './null.json',
        env : 'default'
      });
      runner.init();
      assert.ok(typeof runner.settings.test_settings == 'object');
      assert.strictEqual(runner.settings.test_settings['default'].irrelevantProperty, null);
    },

    testParseTestSettingsIncorrect : function() {
      mockery.registerMock('fs', {
        statSync : function(module) {
          if (module == './incorrect.json') {
            return {isFile : function() {return true}};
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      assert.throws(function() {
        new CliRunner({
          config : './incorrect.json',
          env : 'incorrect'
        }).init();
      }, 'Invalid testing environment specified: incorrect');

    },

    testReadExternalGlobals : function() {
      mockery.registerMock('fs', {
        statSync : function(module) {
          if (module == './custom.json' || module == './globals.json') {
            return {isFile : function() {return true}};
          }
          throw new Error('Does not exist');
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './custom.json',
        env : 'extra'
      }).init();

      runner.settings.globals_path = './globals.json';
      runner.inheritFromDefaultEnv();
      runner.readExternalGlobals();

      assert.equal(runner.test_settings.globals.otherGlobal, 'extra-value');
      assert.equal(runner.test_settings.globals.inheritedGlobal, 'inherited');
      assert.equal(runner.test_settings.globals.someGlobal, 'test');
      assert.equal(runner.test_settings.globals.overwritten, '2');
      assert.equal(runner.test_settings.globals.testGlobalOne, 'one');
      assert.equal(runner.test_settings.globals.testGlobalTwo.two.three, '5');
      assert.equal(runner.test_settings.globals.testGlobalTwo.one, 1);

      assert.throws(function() {
        var runner = new CliRunner({
          config : './custom.json',
          env : 'extra'
        }).init();
        runner.settings.globals_path = './doesnotexist.json';
        runner.readExternalGlobals();

      }, 'External global file could not be located - using ./incorrect.json.');

    },

    testReadExternalGlobalsError : function() {
      mockery.disable();

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './custom.json',
        env : 'extra'
      });

      runner.test_settings = {};
      runner.settings = {
        globals_path : './extra/globals-err.js'
      };

      try {
        runner.readExternalGlobals();
      } catch (ex) {

        assert.equal(ex.name, 'Error reading external global file failed');
        var message = ex.message.split('\n')[0];
        assert.ok(/using(?:.+)\/extra\/globals-err\.js/.test(message));
      }
    },

    testStartSeleniumDisabled : function(done) {
      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './nightwatch.json',
        env : 'default'
      }).init();

      runner.manageSelenium = false;

      runner.startSelenium(function() {
        assert.ok('callback called');

        done();
      });
    },

    testStartSeleniumDisabledPerEnvironment : function() {
      mockery.registerMock('fs', {
        statSync : function(module) {
          if (module == './sauce.json') {
            return {isFile : function() {return true}};
          }
          throw new Error('Does not exist');
        }
      });
      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './sauce.json',
        env : 'saucelabs'
      }).init();

      assert.equal(runner.manageSelenium, false);
      assert.equal(runner.startSession, false);
      assert.equal(runner.endSessionOnFail, true);
    },

    testStartSeleniumEnvironmentOverride : function() {
      mockery.registerMock('fs', {
        statSync : function(module) {
          if (module == './selenium_override.json') {
            return {isFile : function() {return true}};
          }
          throw new Error('Does not exist');
        }
      });
      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './selenium_override.json',
        env : 'default'
      }).init();

      assert.equal(runner.manageSelenium, true);
      assert.equal(runner.startSession, true);
    },

    testStartSeleniuSession : function(done) {
      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './nightwatch.json',
        env : 'default'
      }).init();

      runner.manageSelenium = false;

      runner.startSelenium(function() {
        assert.ok('callback called');
        done();
      });
    },

    testStartSeleniumEnabled : function(done) {
      mockery.registerMock('../selenium.js', {
        startServer : function(settings, cb) {
          cb({}, null, 'Server already running.');
        }
      });
      mockery.registerMock('./errorhandler.js', {
        handle : function(err) {
          assert.equal(err.message, 'Server already running.');
          assert.equal(runner.settings.parallelMode, true);
          done();
        }
      });

      var CliRunner = common.require('runner/cli/clirunner.js');
      var runner = new CliRunner({
        config : './nightwatch.json',
        env : 'default'
      }).init();

      runner.manageSelenium = true;
      runner.parallelMode = true;

      runner.startSelenium();
    },

    beforeEach: function() {
      process.env['ENV_USERNAME'] = 'testuser';

      mockery.enable({ useCleanCache: true, warnOnReplace : false, warnOnUnregistered: false });
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

      mockery.registerMock('./null.json', {
        src_folders : 'tests',
        test_settings : {
          'default' : {
            irrelevantProperty: null
          }
        }
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
          someGlobal : 'test',
          otherGlobal : 'extra-value'
        },
        otherGlobal : 'other-value',
        inheritedGlobal : 'inherited',
        overwritten : '1'
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

      mockery.registerMock('./multi_test_paths.json', {
        src_folders : ['tests1', 'tests2'],
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
        detailed_output : true,
        end_session_on_fail : true,
        test_settings : {
          'default' : {
            output : false,
            disable_colors: true,
            globals : {
              overwritten : '2',
              testGlobalOne : 'one',
              testGlobalTwo : {
                one : 1,
                two : {
                  three : '3'
                }
              }
            }
          },
          'extra' : {
            username : '${ENV_USERNAME}',
            credentials : {
              service : {
                user : '${ENV_USERNAME}'
              }
            },
            globals : {
              testGlobalTwo : {
                two : {
                  three : '5'
                }
              }
            },
            end_session_on_fail : false,
            detailed_output : false,
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
          if (b == './multi_test_paths.json') {
            return './multi_test_paths.json';
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
          if (b == './null.json') {
            return './null.json';
          }
          if (b == './incorrect.json') {
            return './incorrect.json';
          }
          if (b == 'demoTest') {
            return 'demoTest';
          }
          if (b == 'demoGroup') {
            return a + '/demoGroup';
          }
          if (b == 'demoGroup1') {
            return a + '/demoGroup1';
          }
          if (b == 'demoGroup2') {
            return a + '/demoGroup2';
          }
          if (b == 'group_doesnotexist') {
            return a + '/' + b;
          }
          if (b == './sauce.json') {
            return './sauce.json';
          }
          if (b == './selenium_override.json') {
            return './selenium_override.json';
          }
          if (b == '../path/to/test') {
            return process.cwd() + '/path/to/test';
          }
          return './nightwatch.json';
        },
        resolve : function(a) {
          if(a === '../path/to/test'){
            return '/path/to/test';
          }
          return a;
        }
      });
    },

    afterEach: function() {
      mockery.deregisterAll();
      mockery.resetCache();
      mockery.disable();
    }
  }
};
