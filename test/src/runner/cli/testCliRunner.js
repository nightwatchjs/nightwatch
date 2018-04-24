const common = require('../../../common.js');
const mockery = require('mockery');
const assert = require('assert');

describe('Test CLI Runner', function() {

  beforeEach(function() {
    process.env['ENV_USERNAME'] = 'testuser';

    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
    mockery.registerMock('./cli.js', {
      command: function(command) {
        return {
          isDefault: function() {
            return true;
          },
          defaults: function() {
            return './nightwatch.json';
          }
        };
      }
    });

    let config = {
      src_folders: ['tests'],
      envSettings: {
        'default': {
          silent: true
        }
      }
    };

    mockery.registerMock('./nightwatch.json', config);
    mockery.registerMock('./nightwatch.conf.js', config);

    mockery.registerMock('./output_disabled.json', {
      src_folders: ['tests'],
      output_folder: false,
      envSettings: {
        'default': {
          silent: true
        }
      }
    });

    mockery.registerMock('./empty.json', {
      src_folders: 'tests'
    });

    mockery.registerMock('./null.json', {
      src_folders: 'tests',
      envSettings: {
        'default': {
          irrelevantProperty: null
        }
      }
    });

    mockery.registerMock('./incorrect.json', {
      src_folders: 'tests',
      envSettings: {
        'default': {}
      }
    });

    mockery.registerMock('./globals.json', {
      extra: {
        someGlobal: 'test',
        otherGlobal: 'extra-value'
      },
      otherGlobal: 'other-value',
      inheritedGlobal: 'inherited',
      overwritten: '1'
    });

    mockery.registerMock('./settings.json', {
      src_folders: 'tests',
      envSettings: {
        'default': {
          output: false,
          disable_colors: true
        }
      }
    });
    mockery.registerMock('./sauce.json', {
      src_folders: 'tests',
      selenium: {
        start_process: true
      },
      end_session_on_fail: true,
      envSettings: {
        'default': {},
        'saucelabs': {
          selenium: {
            start_process: false,
            start_session: false
          }
        }
      }
    });
    mockery.registerMock('./selenium_override.json', {
      src_folders: 'tests',
      selenium: {
        start_process: false,
        start_session: false
      },
      envSettings: {
        'default': {
          selenium: {
            start_process: true,
            start_session: true
          }
        }
      }
    });

    mockery.registerMock('./multi_test_paths.json', {
      src_folders: ['tests1', 'tests2'],
      envSettings: {
        'default': {
          output: false,
          disable_colors: true
        }
      }
    });

    mockery.registerMock('./custom.json', {
      src_folders: ['tests'],
      selenium: {
        start_process: true
      },
      detailed_output: true,
      end_session_on_fail: true,
      envSettings: {
        'default': {
          output: false,
          disable_colors: true,
          globals: {
            overwritten: '2',
            testGlobalOne: 'one',
            testGlobalTwo: {
              one: 1,
              two: {
                three: '3'
              }
            }
          }
        },
        'extra': {
          username: '${ENV_USERNAME}',
          credentials: {
            service: {
              user: '${ENV_USERNAME}'
            }
          },
          globals: {
            testGlobalTwo: {
              two: {
                three: '5'
              }
            }
          },
          end_session_on_fail: false,
          detailed_output: false,
          selenium: {
            host: 'other.host'
          },

          cli_args: {
            arg1: 'arg1_value',
            arg2: 'arg2_value'
          },

          desiredCapabilities: {
            'test.user': '${ENV_USERNAME}'
          }
        }
      }
    });

    mockery.registerMock('path', {
      join: function(a, b) {
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
      resolve: function(a) {
        if (a === '../path/to/test') {
          return '/path/to/test';
        }
        return a;
      }
    });
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('testInitDefaults', function(done) {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module == './settings.json') {
          throw new Error('Does not exist');
        }
        return {
          isFile: function() {
            return true
          }
        };
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './nightwatch.json',
      env: 'default',
      output: 'output',
      skiptags: 'home,arctic',
      tag: 'danger'
    }).setup();

    assert.deepEqual(runner.settings.src_folders, ['tests']);
    assert.deepEqual(runner.settings.envSettings, {
      'default': {
        silent: true,
        custom_commands_path: '',
        custom_assertions_path: '',
        page_objects_path: '',
        output: true,
        tag_filter: 'danger',
        skiptags: ['home', 'arctic']
      }
    });

    assert.equal(runner.globals.settings.output_folder, 'output');
    assert.equal(runner.globals.settings.parallel_mode, false);
    assert.equal(runner.manageSelenium, false);
    assert.equal(runner.globals.settings.start_session, true);
    done();
  });

  it('testSetOutputFolder', function(done) {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module == './settings.json' || module == './nightwatch.conf.js') {
          throw new Error('Does not exist');
        }
        return {
          isFile: function() {
            return true
          }
        };
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './output_disabled.json',
      env: 'default'
    }).setup();

    assert.equal(runner.globals.settings.output_folder, false);
    done();
  });

  it('testReadSettingsDeprecated', function(done) {
    let disableColorsCalled = false;
    mockery.registerMock('../../util/logger.js', {
      disableColors: function() {
        disableColorsCalled = true;
      }
    });

    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module == './settings.json') {
          return {
            isFile: function() {
              return true
            }
          };
        }
        throw new Error('Does not exist');
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './nightwatch.json',
      env: 'default',
      output: 'output',
      verbose: true,
      skipgroup: 'tobeskipped',
      filter: 'tests*.js'
    }).setup();

    assert.deepEqual(runner.settings.src_folders, ['tests']);
    assert.deepEqual(runner.envSettings.skipgroup, ['tobeskipped']);
    assert.equal(runner.envSettings.output, false);
    assert.equal(runner.envSettings.silent, false);
    assert.equal(runner.envSettings.filename_filter, 'tests*.js');
    assert.ok(disableColorsCalled, 'disable colors not called');
    done();
  });

  it('testCustomSettingsFileAndEnvironment', function(done) {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module == './custom.json') {
          return {
            isFile: function() {
              return true
            }
          };
        }
        throw new Error('Does not exist');
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'extra'
    }).setup();

    assert.equal(runner.manageSelenium, true);
    assert.equal(runner.startSession, true);
    assert.equal(runner.endSessionOnFail, false);
    assert.deepEqual(runner.settings.selenium.cli_args, {arg1: 'arg1_value', arg2: 'arg2_value'});

    assert.equal(runner.settings.selenium.host, 'other.host');
    assert.equal(runner.settings.detailed_output, false);
    assert.equal(runner.envSettings.output, false);
    assert.equal(runner.envSettings.disable_colors, true);
    assert.equal(runner.envSettings.username, 'testuser');
    assert.equal(runner.envSettings.credentials.service.user, 'testuser');
    assert.equal(runner.envSettings.desiredCapabilities['test.user'], 'testuser');
    done();
  });

  it('testGetTestSourceSingle', function(done) {
      let statSyncCalled = false;
      mockery.registerMock('fs', {
        statSync: function(file) {
          if (file == 'demoTest') {
            statSyncCalled = true;
            return {
              isFile: function() {
                return true;
              }
            };
          }
          if (file == 'demoTest.js' || file == './custom.js') {
            return {
              isFile: function() {
                return true
              }
            };
          }
          throw new Error('Does not exist');
        }
      });

      const CliRunner = common.require('runner/cli/cli.js');
      let runner = new CliRunner({
        config: './custom.json',
        env: 'default',
        test: 'demoTest'
      }).setup();

      let testSource = runner.getTestSource();
      assert.equal(testSource, 'demoTest.js');
      assert.ok(statSyncCalled);
    });

    it('testGetTestSourceSingleWithAbsolutePath', function(done) {
      let ABSOLUTE_PATH = '/path/to/test';
      let ABSOLUTE_SRC_PATH = ABSOLUTE_PATH + ".js";
      let statSyncCalled = false;

      mockery.registerMock('fs', {
        statSync: function(file) {
          if (file == ABSOLUTE_PATH) {
            statSyncCalled = true;
            return {
              isFile: function() {
                return true;
              }
            };
          }
          if (file == ABSOLUTE_SRC_PATH || file == './custom.json') {
            return {
              isFile: function() {
                return true
              }
            };
          }
          throw new Error('Does not exist');
        }
      });

      const CliRunner = common.require('runner/cli/cli.js');
      let runner = new CliRunner({
        config: './custom.json',
        env: 'default',
        test: ABSOLUTE_PATH
      }).setup();

      let testSource = runner.getTestSource();
      assert.equal(runner.settings.detailed_output, true);
      assert.equal(testSource, ABSOLUTE_SRC_PATH);
      assert.ok(statSyncCalled);
    done();
    });

  it('testGetTestSourceSingleWithRelativePath', function(done) {
    let RELATIVE_PATH = '../path/to/test';
    let TEST_SRC_PATH = process.cwd() + '/path/to/test.js';
    let statSyncCalled = false;

    mockery.registerMock('fs', {
      statSync: function(file) {
        if (file == RELATIVE_PATH) {
          statSyncCalled = true;
          return {
            isFile: function() {
              return true;
            }
          };
        }
        if (file == TEST_SRC_PATH || file == './custom.json') {
          return {
            isFile: function() {
              return true
            }
          };
        }
        throw new Error('Does not exist');
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'default',
      test: RELATIVE_PATH
    }).setup();

    let testSource = runner.getTestSource();
    assert.equal(testSource, TEST_SRC_PATH);
    assert.ok(statSyncCalled);
    done();
  });

  it('testGetTestSourceAsSecondArgument', function(done) {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module == 'test.js' || module == './custom.json') {
          return {
            isFile: function() {
              return true;
            }
          }
        }
        throw new Error('Does not exist');
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'default',
      _source: ['test.js']
    }).setup();

    let testSource = runner.getTestSource();
    assert.deepEqual(testSource, 'test.js');
    done();
  });

  it('testRunTestsWithTestSourceSingleInvalid', function(done) {
    let invalidTestFile = 'doesnotexist.js';
    let errorMessage = 'ENOENT: no such file or directory, stat \'' + invalidTestFile + '\'';
    mockery.registerMock('fs', {
      existsSync: function(module) {
        if (module == './custom.json') {
          return true;
        }
        return false;
      },
      statSync: function(module) {
        if (module == invalidTestFile) {
          throw new Error(errorMessage);
        }
        throw new Error('Start error.');
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'default',
      test: invalidTestFile
    });

    runner.manageSelenium = true;

    try {
      runner.setup();
    } catch (err) {
      assert.equal(err.message, errorMessage);
      done();
    }
    done();
  });

  it('testRunTestsWithTestcaseOption', function(done) {
    mockery.registerMock('fs', {
      statSync: function(file) {
        if (file == 'demoTest' || file == './custom.json') {
          return {
            isFile: function() {
              return true;
            }
          };
        }
        throw new Error('Does not exist');
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'default',
      test: 'demoTest',
      testcase: 'testCase'
    }).setup();

    runner.getTestSource();
    assert.equal(runner.argv.testcase, 'testCase');
    done();
  });

  it('testRunTestsWithTestcaseOptionAndSingleTestSource', function(done) {
    mockery.registerMock('fs', {
      statSync: function(file) {
        if (file == 'demoTest.js' || file == './custom.json') {
          return {
            isFile: function() {
              return true;
            }
          };
        }
        throw new Error('Does not exist');
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'default',
      _source: ['demoTest.js'],
      testcase: 'testCase'
    }).setup();

    let testSource = runner.getTestSource();
    assert.equal(runner.argv.testcase, 'testCase');
    done();
  });

  it('testRunTestsWithTestcaseOptionAndWithoutTest', function(done) {
    mockery.registerMock('fs', {
      statSync: function(file) {
        if (file == 'demoTest.js' || file == './custom.json') {
          return {
            isFile: function() {
              return true
            }
          };
        }
        throw new Error('Does not exist');
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'default',
      testcase: 'testCase'
    }).setup();

    let testSource = runner.getTestSource();
    assert.equal(runner.argv.testcase, null);
    done();
  });

  it('testGetTestSourceGroup', function(done) {
    mockery.registerMock('fs', {
      statSync: function(module) {
        switch (module) {
          case './custom.json':
          case './multi_test_paths.json':
            return {
              isFile: function() {
                return true
              }
            };
          case 'tests/demoGroup':
            return {
              isDirectory: function() {
                return true
              }
            };
        }
        throw new Error('Does not exist');
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'default',
      group: 'demoGroup'
    }).setup();

    let testSource = runner.getTestSource();
    assert.deepEqual(testSource, ['tests/demoGroup']);

    let otherRunner = new CliRunner({
      config: './custom.json',
      env: 'default',
      group: 'tests/demoGroup'
    }).setup();

    testSource = otherRunner.getTestSource();
    assert.deepEqual(testSource, ['tests/demoGroup']);

    let simpleRunner = new CliRunner({
      config: './custom.json',
      env: 'default'
    }).setup();

    testSource = simpleRunner.getTestSource();
    assert.deepEqual(testSource, ['tests']);

    let invalidGroupRunner = new CliRunner({
      config: './custom.json',
      env: 'default',
      group: 'group_doesnotexist'
    }).setup();

    testSource = invalidGroupRunner.getTestSource();
    assert.deepEqual(testSource, ['tests/group_doesnotexist']);

    let invalidGroupInMultiSrcRunner = new CliRunner({
      config: './multi_test_paths.json',
      env: 'default',
      group: 'group_doesnotexist'
    }).setup();

    testSource = invalidGroupInMultiSrcRunner.getTestSource();
    assert.deepEqual(testSource, []);
    done();
  });

  it('testGetTestSourceMultipleGroups', function(done) {
    mockery.registerMock('fs', {
      statSync: function(module) {
        switch (module) {
          case './custom.json':
          case './multi_test_paths.json':
            return {
              isFile: function() {
                return true
              }
            };
          case 'tests/demoGroup1':
          case 'tests/demoGroup2':
          case 'tests1/demoGroup1':
          case 'tests1/demoGroup2':
          // no tests2/demoGroup1
          case 'tests2/demoGroup2':
            return {
              isDirectory: function() {
                return true
              }
            };
        }
        throw new Error('Does not exist');
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'default',
      group: 'demoGroup1,demoGroup2'
    }).setup();

    let testSource = runner.getTestSource();
    assert.deepEqual(testSource, ['tests/demoGroup1', 'tests/demoGroup2']);

    let invalidGroupRunner = new CliRunner({
      config: './custom.json',
      env: 'default',
      group: 'demoGroup1,demoGroup2,group_doesnotexist'
    }).setup();

    testSource = invalidGroupRunner.getTestSource();
    assert.deepEqual(testSource, ['tests/demoGroup1', 'tests/demoGroup2', 'tests/group_doesnotexist']);

    let stripMissingInMultiRunner = new CliRunner({
      config: './multi_test_paths.json',
      env: 'default',
      group: 'demoGroup1,demoGroup2,group_doesnotexist'
    }).setup();

    testSource = stripMissingInMultiRunner.getTestSource();
    assert.deepEqual(testSource, ['tests1/demoGroup1', 'tests1/demoGroup2', 'tests2/demoGroup2']);
    done();
  });

  it('testParseTestSettingsInvalid', function(done) {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module == './empty.json') {
          return {
            isFile: function() {
              return true
            }
          };
        }
        throw new Error('Does not exist');
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    assert.throws(function() {
      new CliRunner({
        config: './empty.json',
        env: 'default'
      }).setup();
    }, /No testing environment specified\./);
    done();
  });

  it('testParseTestSettingsNull', function(done) {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module == './null.json') {
          return {
            isFile: function() {
              return true;
            }
          };
        }
        throw new Error('Does not exist');
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');

    let runner = new CliRunner({
      config: './null.json',
      env: 'default'
    });
    runner.setup();
    assert.ok(typeof runner.settings.envSettings == 'object');
    assert.strictEqual(runner.settings.envSettings['default'].irrelevantProperty, null);
    done();
  });

  it('testParseTestSettingsIncorrect', function(done) {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module == './incorrect.json') {
          return {
            isFile: function() {
              return true
            }
          };
        }
        throw new Error('Does not exist');
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    assert.throws(function() {
      new CliRunner({
        config: './incorrect.json',
        env: 'incorrect'
      }).setup();
    }, /Invalid testing environment specified\: incorrect/);

    done();
  });

  it('testReadExternalGlobals', function(done) {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module == './custom.json' || module == './globals.json') {
          return {
            isFile: function() {
              return true
            }
          };
        }
        throw new Error('Does not exist');
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'extra'
    }).setup();

    runner.settings.globals_path = './globals.json';
    runner.inheritFromDefaultEnv();
    runner.readExternalGlobals();

    assert.equal(runner.envSettings.globals.otherGlobal, 'extra-value');
    assert.equal(runner.envSettings.globals.inheritedGlobal, 'inherited');
    assert.equal(runner.envSettings.globals.someGlobal, 'test');
    assert.equal(runner.envSettings.globals.overwritten, '2');
    assert.equal(runner.envSettings.globals.testGlobalOne, 'one');
    assert.equal(runner.envSettings.globals.testGlobalTwo.two.three, '5');
    assert.equal(runner.envSettings.globals.testGlobalTwo.one, 1);

    assert.throws(function() {
      let runner = new CliRunner({
        config: './custom.json',
        env: 'extra'
      }).setup();
      runner.settings.globals_path = './doesnotexist.json';
      runner.readExternalGlobals();

    }, 'External global file could not be located - using ./incorrect.json.');

    done();
  });

  it('testReadExternalGlobalsError', function(done) {
    mockery.disable();

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'extra'
    });

    runner.envSettings = {};
    runner.settings = {
      globals_path: './extra/globals-err.js'
    };

    try {
      runner.readExternalGlobals();
    } catch (ex) {

      assert.equal(ex.name, 'Error reading external global file failed');
      let message = ex.message.split('\n')[0];
      assert.ok(/using(?:.+)\/extra\/globals-err\.js/.test(message));
    }
    done();
  });

  it('testStartSeleniumDisabled', function(done) {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './nightwatch.json',
      env: 'default'
    }).setup();

    runner.manageSelenium = false;

    runner.startSelenium(function() {
      assert.ok('callback called');

      done();
    });
    done();
  });

  it('testStartSeleniumDisabledPerEnvironment', function(done) {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module == './sauce.json') {
          return {
            isFile: function() {
              return true
            }
          };
        }
        throw new Error('Does not exist');
      }
    });
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './sauce.json',
      env: 'saucelabs'
    }).setup();

    assert.equal(runner.manageSelenium, false);
    assert.equal(runner.startSession, false);
    assert.equal(runner.endSessionOnFail, true);
    done();
  });

  it('testStartSeleniumEnvironmentOverride', function(done) {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module == './selenium_override.json') {
          return {
            isFile: function() {
              return true
            }
          };
        }
        throw new Error('Does not exist');
      }
    });
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './selenium_override.json',
      env: 'default'
    }).setup();

    assert.equal(runner.manageSelenium, true);
    assert.equal(runner.startSession, true);
    done();
  });

  it('testStartSeleniuSession', function(done) {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './nightwatch.json',
      env: 'default'
    }).setup();

    runner.manageSelenium = false;

    runner.startSelenium(function() {
      assert.ok('callback called');
      done();
    });
    done();
  });

  it('testStartSeleniumEnabled', function(done) {
    mockery.registerMock('../selenium.js', {
      startServer: function(settings, cb) {
        cb({}, null, 'Server already running.');
      }
    });
    mockery.registerMock('./errorhandler.js', {
      handle: function(err) {
        assert.equal(err.message, 'Server already running.');
        assert.equal(runner.settings.parallelMode, true);
        done();
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './nightwatch.json',
      env: 'default'
    }).setup();

    runner.manageSelenium = true;
    runner.parallelMode = true;

    runner.startSelenium();
    done();
  });


});

