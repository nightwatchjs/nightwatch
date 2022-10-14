const common = require('../../common.js');
const mockery = require('mockery');
const assert = require('assert');
const CI_Info = require('ci-info');
const isCi = CI_Info.isCI;
const path = require('path');

describe('test CLI Runner Mocha', function() {
  beforeEach(function() {
    process.env['ENV_USERNAME'] = 'testuser';

    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    mockery.registerMock('package.json', {});
    mockery.registerMock('./argv-setup.js', {
      isDefault(option, value) {
        return value.includes('nightwatch.');
      },

      getDefault() {
        return './nightwatch.json';
      }
    });

    mockery.registerMock('path', {
      resolve: function(a) {
        return a;
      },
      join: path.join
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
    const testFiles = [];

    const defaultOptions = {timeout: 20000, reporterOptions: {}};
    if (isCi) {
      defaultOptions.color = false;
    }

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
      assert.deepStrictEqual(options, defaultOptions);
    }, testFiles);

    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      config: './withmocha.json',
      env: 'default',
      reporter: 'junit'
    }).setup();

    return runner.runTests().then(function() {
      assert.deepStrictEqual(testFiles, ['test1.js', 'test2.js']);
    });
  });

  it('testRunWithMochaPerEnvironment', function() {
    const testFiles = [];
    const defaultOptions = {timeout: 20000, reporterOptions: {}};
    if (isCi) {
      defaultOptions.color = false;
    }

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
      assert.deepStrictEqual(options, defaultOptions);
    }, testFiles);

    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      config: './withmocha.json',
      env: 'mochatests',
      reporter: 'junit'
    }).setup();

    return runner.runTests().then(function() {
      assert.deepStrictEqual(testFiles, ['test1.js', 'test2.js']);
    });
  });

  it('testRunWithMochaCustomOpts', function() {
    const testFiles = [];

    const defaultOptions = {
      ui: 'tdd',
      timeout: 20000,
      reporterOptions: {}
    };

    if (isCi) {
      defaultOptions.color = false;
    }

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
      assert.deepStrictEqual(options, defaultOptions);
    }, testFiles);

    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      config: './withmocha.json',
      env: 'default',
      reporter: 'junit'
    }).setup();

    return runner.runTests().then(function() {
      assert.deepStrictEqual(testFiles, ['test1.js', 'test2.js']);
    });
  });

  it('testRunWithMochaReporterOptions', function() {
    const testFiles = [];

    const mochaOptions = {
      timeout: 20000, 
      reporterOptions: {
        reportDir: 'html-dir'
      },
      reporter: 'mochawesome'
    };

    if (isCi) {
      mochaOptions.color = false;
    }

    mockery.registerMock('mochawesome', {});

    mockery.registerMock('./withmochaReportOptions.json', {
      src_folders: ['tests'],
      output_folder: false,
      test_settings: {
        'default': {
          silent: true
        }
      },
      reporter_options: {
        reportDir: 'html-dir'
      },
      test_runner: {
        type: 'mocha',
        options: {
          reporter: 'mochawesome'
        }
      }
    });

    createMockedMocha(function(options) {
      assert.deepStrictEqual(options, mochaOptions);
    }, testFiles);

    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      config: './withmochaReportOptions.json',
      env: 'default',
      reporter: 'junit'
    }).setup();

    return runner.runTests().then(function() {
      assert.deepStrictEqual(testFiles, ['test1.js', 'test2.js']);
    });
  });

});


function createMockedMocha(assertionFn = function() {}, testFiles = []) {
  function Mocha(options) {
    this.suite = {
      on() {}
    };
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
