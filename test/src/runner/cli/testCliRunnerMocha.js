const common = require('../../../common.js');
const mockery = require('mockery');
const assert = require('assert');

describe('test CLI Runner Mocha', function() {
  beforeEach(function() {
    process.env['ENV_USERNAME'] = 'testuser';

    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
    mockery.registerMock('./argv-setup.js', {
      command: function(command) {
        return {
          isDefault: function(file) {
            return file.includes('nightwatch.');
          },
          defaults: function() {
            return './nightwatch.json';
          }
        };
      }
    });
    mockery.registerMock('path', {
      resolve: function(a) {
        return a;
      }
    });

    mockery.registerMock('./folder-walk.js', class Walk {
      readTestSource(source, settings, cb) {
        return Promise.resolve([
          'test1.js',
          'test2.js'
        ]);
      }
    });
    mockery.registerMock('../../index.js', {
      client(settings) {
        return {
          api: {},
          settings: {}
        };
      }
    });

  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('testRunWithMochaDefaults', function() {
    let testFiles = [];

    mockery.registerMock('./withmocha.json', {
      src_folders: ['tests'],
      output_folder: false,
      test_settings: {
        'default': {
          silent: true
        }
      },
      test_runner: 'mocha'
    });

    createMockedMocha(function(options) {
      assert.deepEqual(options, {timeout: 10000});
    }, testFiles);

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './withmocha.json',
      env: 'default'
    }).setup();

    return runner.runTests().then(function() {
      assert.deepEqual(testFiles, ['test1.js', 'test2.js']);
    });
  });

  it('testRunWithMochaPerEnvironment', function() {
    let testFiles = [];

    mockery.registerMock('./withmocha.json', {
      src_folders: ['tests'],
      output_folder: false,
      test_settings: {
        'default': {
          silent: true
        },
        mochatests: {
          test_runner: 'mocha'
        }
      },
      test_runner: 'default'
    });

    createMockedMocha(function(options) {
      assert.deepEqual(options, {timeout: 10000});
    }, testFiles);

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './withmocha.json',
      env: 'mochatests'
    }).setup();

    return runner.runTests().then(function() {
      assert.deepEqual(testFiles, ['test1.js', 'test2.js']);
    });
  });

  it('testRunWithMochaCustomOpts', function() {
    let testFiles = [];

    mockery.registerMock('./withmocha.json', {
      src_folders: ['tests'],
      output_folder: false,
      test_settings: {
        'default': {
          silent: true
        }
      },
      test_runner: {
        type: 'mocha',
        options: {
          ui: 'tdd'
        }
      }
    });

    createMockedMocha(function(options) {
      assert.deepEqual(options, {
        ui: 'tdd',
        timeout: 10000
      });
    }, testFiles);

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './withmocha.json',
      env: 'default'
    }).setup();

    return runner.runTests().then(function() {
      assert.deepEqual(testFiles, ['test1.js', 'test2.js']);
    });
  });
});


function createMockedMocha(assertionFn = function() {}, testFiles = []) {
  function Mocha(options) {
    this.suite = {};
    assertionFn(options);
  }

  Mocha.prototype = {
    addFile: function(file) {
      testFiles.push(file);
    },
    run: function(cb) {
      cb(null);
    }
  };

  Mocha.Runner = function() {
    this.suite = {};
  };

  Mocha.Runner.prototype = {
    runSuite() {},
    run(fn) {}
  };

  mockery.registerMock('mocha', Mocha);
}
