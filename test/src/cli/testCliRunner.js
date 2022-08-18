const common = require('../../common.js');
const mockery = require('mockery');
const assert = require('assert');
const origPath = require('path');
const {constants, rmdirSync} = require('fs');

delete require.cache['fs'];
delete require.cache['path'];

describe('Test CLI Runner', function() {

  beforeEach(function() {
    process.env['ENV_USERNAME'] = 'testuser';

    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
    mockery.registerMock('./argv-setup.js', {
      isDefault(option, value) {
        return value.includes('nightwatch.');
      },

      getDefault() {
        return './nightwatch.json';
      }
    });

    let config = {
      src_folders: ['tests'],
      test_settings: {
        'default': {
          silent: true
        }
      }
    };

    let promiseConfig = Promise.resolve({
      src_folders: ['promiseTests'],
      test_settings: {
        default: {
          silent: true
        }
      }
    });

    mockery.registerMock('package.json', {});
    mockery.registerMock('./nightwatch.json', config);
    mockery.registerMock('./nightwatch.conf.js', config);
    mockery.registerMock('./nightwatchPromise.conf.js', promiseConfig);

    mockery.registerMock('./output_disabled.json', {
      src_folders: ['tests'],
      output_folder: false,
      test_settings: {
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
      test_settings: {
        'default': {
          irrelevantProperty: null
        }
      }
    });

    mockery.registerMock('./incorrect.json', {
      src_folders: 'tests',
      test_settings: {
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
      test_settings: {
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
      test_settings: {
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
      test_settings: {
        'default': {
          selenium: {
            start_process: true,
            start_session: true,
            server_path: './selenium.jar'
          }
        }
      }
    });

    mockery.registerMock('./multi_test_paths.json', {
      src_folders: ['tests1', 'tests2'],
      test_settings: {
        'default': {
          output: false,
          disable_colors: true
        }
      }
    });

    mockery.registerMock('./custom.json', {
      src_folders: ['tests'],
      selenium: {
        start_process: true,
        server_path: './selenium.jar'
      },
      detailed_output: true,
      end_session_on_fail: true,
      test_settings: {
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
      basename(a) {
        if (a === './globals.json') {
          return 'globals';
        }
      },
      dirname(a) {
        return '';
      },
      join: function(a, b) {
        if (b === './settings.json') {
          return './settings.json';
        }
        if (b === './multi_test_paths.json') {
          return './multi_test_paths.json';
        }
        if (b === './custom.json') {
          return './custom.json';
        }
        if (b === './output_disabled.json') {
          return './output_disabled.json';
        }
        if (b === './empty.json') {
          return './empty.json';
        }
        if (b === './null.json') {
          return './null.json';
        }
        if (b === './incorrect.json') {
          return './incorrect.json';
        }
        if (b === 'demoTest') {
          return 'demoTest';
        }
        if (b === 'demoGroup') {
          return a + '/demoGroup';
        }
        if (b === 'demoGroup1') {
          return a + '/demoGroup1';
        }
        if (b === 'demoGroup2') {
          return a + '/demoGroup2';
        }
        if (b === 'group_doesnotexist') {
          return a + '/' + b;
        }
        if (b === './sauce.json') {
          return './sauce.json';
        }
        if (b === './selenium_override.json') {
          return './selenium_override.json';
        }
        if (b === '../path/to/test') {
          return process.cwd() + '/path/to/test';
        }
        if (b === './doesnotexist.json') {
          return './doesnotexist.json';
        }
        if (b === './extra/globals-err.js') {
          return './extra/globals-err.js';
        }
        if (b === './nightwatchPromise.conf.js') {
          return './nightwatchPromise.conf.js';
        }

        return './nightwatch.json';
      },
      resolve: function(a) {
        if (a === '../path/to/test') {
          return '/path/to/test';
        }

        return a;
      },
      extname(a) {
        return '.js';
      },
      parse(source) {
        return origPath.parse(source);
      }
    });
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  function registerNoSettingsJsonMock(){
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module === './settings.json') {
          throw new Error('Does not exist');
        }

        return {
          isFile: function() {
            return true;
          }
        };
      },
      constants,
      rmdirSync
    });
  }

  it('should have reasonable defaults for CLI arguments', function() {
    registerNoSettingsJsonMock();

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './nightwatch.json'
    }).setup();

    assert.deepStrictEqual(runner.settings.src_folders, ['tests']);
    assert.strictEqual(runner.test_settings.silent, true);
    assert.strictEqual(runner.test_settings.custom_commands_path, null);
    assert.strictEqual(runner.test_settings.custom_assertions_path, null);
    assert.strictEqual(runner.test_settings.output, true);
    assert.strictEqual(runner.test_settings.tag_filter, undefined);
    assert.strictEqual(runner.test_settings.skiptags, '');
    assert.strictEqual(runner.test_settings.filename_filter, undefined);
    assert.strictEqual(runner.test_settings.skipgroup, '');
    assert.strictEqual(runner.globals.settings.output_folder, 'tests_output');
    assert.strictEqual(runner.globals.settings.parallel_mode, false);
    assert.strictEqual(runner.globals.settings.start_session, true);
  });

  it('should have defaults for CLI argument for promise config', async () => {
    registerNoSettingsJsonMock();

    const CliRunner = common.require('runner/cli/cli.js');
    const instance = new CliRunner({
      config: './nightwatchPromise.conf.js'
    });
    const runner = await instance.setupAsync();

    assert.deepStrictEqual(runner.settings.src_folders, ['promiseTests']);
    assert.strictEqual(runner.test_settings.silent, true);
    assert.strictEqual(runner.test_settings.custom_commands_path, null);
    assert.strictEqual(runner.test_settings.custom_assertions_path, null);
    assert.strictEqual(runner.test_settings.output, true);
    assert.strictEqual(runner.test_settings.tag_filter, undefined);
    assert.strictEqual(runner.test_settings.skiptags, '');
    assert.strictEqual(runner.test_settings.filename_filter, undefined);
    assert.strictEqual(runner.test_settings.skipgroup, '');
    assert.strictEqual(runner.globals.settings.output_folder, 'tests_output');
    assert.strictEqual(runner.globals.settings.parallel_mode, false);
    assert.strictEqual(runner.globals.settings.start_session, true);
  });

  it('should override settings with CLI arguments', function() {
    registerNoSettingsJsonMock();
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './nightwatch.json',
      verbose: 'yes',
      output: 'test-output-folder',
      skiptags: 'home,arctic',
      tag: 'danger',
      filter: 'test-filename-filter',
      skipgroup: 'test-skip-group',
      timeout: 11,
      devtools: true,
      debug: true
    }).setup();

    assert.strictEqual(runner.argv.devtools, true);
    assert.strictEqual(runner.argv.debug, true);
    assert.strictEqual(runner.test_settings.silent, false);
    assert.strictEqual(runner.test_settings.tag_filter, 'danger');
    assert.strictEqual(runner.test_settings.skiptags, 'home,arctic');
    assert.strictEqual(runner.test_settings.filename_filter, 'test-filename-filter');
    assert.deepStrictEqual(runner.test_settings.skipgroup, ['test-skip-group']);
    assert.strictEqual(runner.globals.settings.output_folder, 'test-output-folder');
    assert.strictEqual(runner.test_settings.globals.waitForConditionTimeout, 11);
    assert.strictEqual(runner.test_settings.globals.retryAssertionTimeout, 11);
  });

  it('testSetOutputFolder', function() {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module === './settings.json' || module === './nightwatch.conf.js') {
          throw new Error('Does not exist');
        }

        return {
          isFile: function() {
            return true;
          }
        };
      },
      constants,
      rmdirSync
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './output_disabled.json',
      env: 'default'
    }).setup();

    assert.strictEqual(runner.settings.output_folder, false);
  });

  it('testReadSettingsDeprecated', function(done) {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module === './settings.json') {
          return {
            isFile: function() {
              return true;
            }
          };
        }
        throw new Error('Does not exist');
      },
      constants,
      rmdirSync
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './settings.json',
      env: 'default',
      output: 'output',
      verbose: true,
      skipgroup: 'tobeskipped',
      filter: 'tests*.js'
    }).setup();

    assert.deepStrictEqual(runner.test_settings.src_folders, ['tests']);
    assert.deepStrictEqual(runner.test_settings.skipgroup, ['tobeskipped']);
    assert.strictEqual(runner.test_settings.output, false);
    assert.strictEqual(runner.test_settings.silent, false);
    assert.strictEqual(runner.test_settings.disable_error_log, false);
    assert.strictEqual(runner.test_settings.disable_colors, true);
    assert.strictEqual(runner.test_settings.filename_filter, 'tests*.js');

    done();
  });

  it('testCustomSettingsFileAndEnvironment', function() {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module === './custom.json') {
          return {
            isFile: function() {
              return true;
            }
          };
        }
        throw new Error('Does not exist');
      },
      constants,
      rmdirSync
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'extra'
    }).setup();

    assert.strictEqual(runner.test_settings.selenium.host, 'other.host');
    assert.strictEqual(runner.test_settings.detailed_output, false);
    assert.strictEqual(runner.test_settings.output, false);
    assert.strictEqual(runner.test_settings.disable_colors, true);
    assert.strictEqual(runner.test_settings.username, 'testuser');
    assert.strictEqual(runner.test_settings.credentials.service.user, 'testuser');
    assert.strictEqual(runner.test_settings.desiredCapabilities['test.user'], 'testuser');

  });

  it('testGetTestSourceSingle', function() {
    let statCalled = false;
    let statSyncCalled = false;
    
    mockery.registerMock('fs', {
      statSync: function(file) {
        if (file === 'demoTest') {
          statSyncCalled = true;

          return {
            isFile: function() {
              return true;
            }
          };
        }

        if (file === 'demoTest.js' || file === './custom.js') {
          return {isFile: function() {return true}};
        }

        throw new Error('Does not exist');
      },
      

      stat(file, cb) {
        if (file === 'demoTest') {
          statCalled = true;
        }

        if (file === 'demoTest' || file === 'demoTest.js' || file === './custom.js') {
          return cb(null, {
            isFile() {
              return true;
            }
          });
        }

        throw new Error('Does not exist');
      },

      constants,
      rmdirSync
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'default',
      test: 'demoTest'
    }).setup();

    const Runner = common.require('runner/runner.js');

    return Runner
      .readTestSource(runner.test_settings, runner.argv)
      .then(function(modules) {
        assert.strictEqual(modules[0], 'demoTest.js');
        assert.ok(statSyncCalled);
      });
  });

  it('testGetTestSourceSingleWithAbsolutePath', function() {
    let ABSOLUTE_PATH = '/path/to/test';
    let ABSOLUTE_SRC_PATH = ABSOLUTE_PATH + '.js';
    let statSyncCalled = false;

    mockery.registerMock('fs', {
      statSync: function(file) {
        if (file === ABSOLUTE_PATH) {
          statSyncCalled = true;

          return {
            isFile: function() {
              return true;
            }
          };
        }
        if (file === ABSOLUTE_SRC_PATH || file === './custom.json') {
          return {
            isFile: function() {
              return true;
            }
          };
        }
        throw new Error('Does not exist');
      },

      stat(file, cb) {
        if (file === ABSOLUTE_SRC_PATH || file === './custom.js') {
          return cb(null, {
            isFile() {
              return true;
            }
          });
        }

        throw new Error('Does not exist');
      },
      constants,
      rmdirSync
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'default',
      test: ABSOLUTE_PATH
    }).setup();

    assert.strictEqual(runner.test_settings.detailed_output, true);

    const Runner = common.require('runner/runner.js');

    return Runner
      .readTestSource(runner.test_settings, runner.argv)
      .then(function(modules) {
        assert.strictEqual(modules[0], ABSOLUTE_SRC_PATH);
        assert.ok(statSyncCalled);
      });
  });

  it('testGetTestSourceSingleWithRelativePath', function() {
    let RELATIVE_PATH = '../path/to/test';
    let TEST_SRC_PATH = process.cwd() + '/path/to/test.js';
    let statSyncCalled = false;

    mockery.registerMock('fs', {
      stat(file, cb) {
        if (file === TEST_SRC_PATH || file === './custom.js') {
          return cb(null, {
            isFile() {
              return true;
            }
          });
        }

        throw new Error('Does not exist');
      },
      statSync: function(file) {
        if (file === RELATIVE_PATH) {
          statSyncCalled = true;

          return {
            isFile: function() {
              return true;
            }
          };
        }
        if (file === TEST_SRC_PATH || file === './custom.json') {
          return {
            isFile: function() {
              return true;
            }
          };
        }
        throw new Error('Does not exist');
      },
      constants,
      rmdirSync
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'default',
      test: RELATIVE_PATH
    }).setup();

    const Runner = common.require('runner/runner.js');

    return Runner.readTestSource(runner.test_settings, runner.argv)
      .then(function(modules) {
        assert.strictEqual(modules[0], TEST_SRC_PATH);
        assert.ok(statSyncCalled);
      });
  });

  it('testGetTestSourceGroup', function() {
    mockery.registerMock('fs', {
      statSync: function(module) {
        switch (module) {
          case './custom.json':
          case './multi_test_paths.json':
            return {
              isFile: function() {
                return true;
              }
            };
          case 'tests/demoGroup':
            return {
              isDirectory: function() {
                return true;
              }
            };
        }
        throw new Error('Does not exist');
      },
      constants,
      rmdirSync
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'default',
      group: 'demoGroup'
    }).setup();

    const Runner = common.require('runner/runner.js');

    const walker = Runner.getTestSource(runner.test_settings, runner.argv);
    assert.deepStrictEqual(walker.testSource, ['tests/demoGroup']);

    let otherRunner = new CliRunner({
      config: './custom.json',
      env: 'default',
      group: 'tests/demoGroup'
    }).setup();

    const walker2 = Runner.getTestSource(otherRunner.test_settings, otherRunner.argv);
    assert.deepStrictEqual(walker2.testSource, ['tests/demoGroup']);

    let simpleRunner = new CliRunner({
      config: './custom.json',
      env: 'default'
    }).setup();

    const walker3 = Runner.getTestSource(simpleRunner.test_settings, simpleRunner.argv);
    assert.deepStrictEqual(walker3.testSource, ['tests']);

    let invalidGroupRunner = new CliRunner({
      config: './custom.json',
      env: 'default',
      group: 'group_doesnotexist'
    }).setup();

    const walker4 = Runner.getTestSource(invalidGroupRunner.test_settings, invalidGroupRunner.argv);
    assert.deepStrictEqual(walker4.testSource, ['tests/group_doesnotexist']);

    let invalidGroupInMultiSrcRunner = new CliRunner({
      config: './multi_test_paths.json',
      env: 'default',
      group: 'group_doesnotexist'
    }).setup();

    try {
      Runner.getTestSource(invalidGroupInMultiSrcRunner.test_settings, invalidGroupInMultiSrcRunner.argv);
    } catch (ex) {
      assert.ok(ex.message.includes('No test source specified, please check "src_folders" config; src_folders: "tests1", "tests2"; group(s): "group_doesnotexist".'));
    }
  });

  it('testGetTestSourceMultipleGroups', function() {
    mockery.registerMock('fs', {
      statSync: function(module) {
        switch (module) {
          case './custom.json':
          case './multi_test_paths.json':
            return {
              isFile: function() {
                return true;
              }
            };
          case 'tests/demoGroup1':
          case 'tests/demoGroup2':
          case 'tests1/demoGroup1':
          case 'tests1/demoGroup2':
          case 'tests2/demoGroup2':
            return {
              isDirectory: function() {
                return true;
              }
            };
        }
        throw new Error('Does not exist');
      },
      constants,
      rmdirSync
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'default',
      group: 'demoGroup1,demoGroup2'
    }).setup();

    const Runner = common.require('runner/runner.js');

    const walker = Runner.getTestSource(runner.test_settings, runner.argv);
    assert.deepStrictEqual(walker.testSource, ['tests/demoGroup1', 'tests/demoGroup2']);

    let invalidGroupRunner = new CliRunner({
      config: './custom.json',
      env: 'default',
      group: 'demoGroup1,demoGroup2,group_doesnotexist'
    }).setup();

    const walker2 = Runner.getTestSource(invalidGroupRunner.test_settings, invalidGroupRunner.argv);
    assert.deepStrictEqual(walker2.testSource, ['tests/demoGroup1', 'tests/demoGroup2', 'tests/group_doesnotexist']);

    let stripMissingInMultiRunner = new CliRunner({
      config: './multi_test_paths.json',
      env: 'default',
      group: 'demoGroup1,demoGroup2,group_doesnotexist'
    }).setup();

    const walker3 = Runner.getTestSource(stripMissingInMultiRunner.test_settings, stripMissingInMultiRunner.argv);
    assert.deepStrictEqual(walker3.testSource, ['tests1/demoGroup1', 'tests1/demoGroup2', 'tests2/demoGroup2']);
  });

  it('testParseTestSettingsNull', function() {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module === './null.json') {
          return {
            isFile: function() {
              return true;
            }
          };
        }
        throw new Error('Does not exist');
      },
      constants,
      rmdirSync
    });

    const CliRunner = common.require('runner/cli/cli.js');

    let runner = new CliRunner({
      config: './null.json',
      env: 'default'
    });

    runner.setup();
    assert.ok(typeof runner.test_settings === 'object');
    assert.strictEqual(runner.test_settings.irrelevantProperty, null);
  });

  it('testParseTestSettingsIncorrect', function() {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module === './incorrect.json') {
          return {
            isFile: function() {
              return true;
            }
          };
        }
        throw new Error('Does not exist');
      },
      constants,
      rmdirSync
    });

    const CliRunner = common.require('runner/cli/cli.js');
    assert.throws(function() {
      new CliRunner({
        config: './incorrect.json',
        env: 'incorrect'
      }).setup();
    }, /Invalid testing environment specified: incorrect\./);
  });

  it('testReadExternalGlobals', function() {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module === './custom.json' || module === './globals.json') {
          return {
            isFile: function() {
              return true;
            }
          };
        }
        throw new Error('Does not exist');
      },
      constants,
      rmdirSync
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './custom.json',
      env: 'extra'
    }).setup({
      globals_path: './globals.json'
    });

    assert.strictEqual(runner.test_settings.globals.otherGlobal, 'extra-value');
    assert.strictEqual(runner.test_settings.globals.inheritedGlobal, 'inherited');
    assert.strictEqual(runner.test_settings.globals.someGlobal, 'test');
    assert.strictEqual(runner.test_settings.globals.overwritten, '1');
    assert.strictEqual(runner.test_settings.globals.testGlobalOne, 'one');
    assert.strictEqual(runner.test_settings.globals.testGlobalTwo.two.three, '5');
    assert.strictEqual(runner.test_settings.globals.testGlobalTwo.one, 1);


    try {
      new CliRunner({
        config: './custom.json',
        env: 'extra'
      }).setup({
        globals_path: './doesnotexist.json'
      });
    } catch (er) {
      assert.strictEqual(er.message, 'cannot read external global file using "./doesnotexist.json"');
    }


  });

  it('testReadExternalGlobalsError', function() {
    mockery.registerMock('fs', {
      statSync: function(module) {
        if (module === './custom.json') {
          return {
            isFile: function() {
              return true;
            }
          };
        }
        throw new Error('Does not exist');
      },
      constants,
      rmdirSync
    });

    const CliRunner = common.require('runner/cli/cli.js');

    try {
      new CliRunner({
        config: './custom.json',
        env: 'extra'
      }).setup({
        globals_path: './extra/globals-err.js'
      });
    } catch (err) {
      assert.strictEqual(err.message, 'cannot read external global file using "./extra/globals-err.js"');
    }
  });

  it('using ES module config file', function() {
    mockery.deregisterMock('package.json');
    mockery.registerMock('./nightwatch.conf.cjs', {
      src_folders: ['tests'],
      test_settings: {
        default: {
          silent: true
        }
      }
    });

    mockery.registerMock('package.json', {
      type: 'module'
    });

    registerNoSettingsJsonMock();

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './nightwatch.json'
    }).setup();

    assert.strictEqual(runner.argv.config, './nightwatch.conf.cjs');
  });

  it('using no package.json file', function() {
    mockery.deregisterMock('package.json');
    mockery.registerMock('package.json');

    registerNoSettingsJsonMock();

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({});

    const config = runner.getLocalConfigFileName();
    assert.strictEqual(config, './nightwatch.conf.js');
  });
});
