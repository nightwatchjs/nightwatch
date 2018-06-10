const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

describe('testRunWithExclude', function() {

  before(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('testRunWithExcludeFolder', function() {
    const originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../sampletests/'));

    let testsPath = ['./withexclude'];
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok(!('excluded/not-excluded' in results.modules));
          assert.ok('simple/sample' in results.modules);
          process.chdir(originalCwd);

          cb();
        }
      },
      exclude: ['./withexclude/excluded'],
      output_folder: false
    };

    return NightwatchClient.runTests({
      _source: testsPath
    }, settings);
  });

  it('testRun with exclude folder name and multiple src_folders', function() {
    const originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../sampletests/'));

    let srcFolders = ['./withexclude/excluded', './withexclude/simple'];
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results, cb) {
          assert.ok('excluded/excluded-module' in results.modules);
          assert.ok('excluded/not-excluded' in results.modules);
          assert.ok(!('simple/sample' in results.modules));
          process.chdir(originalCwd);

          cb();
        }
      },
      src_folders: srcFolders,
      exclude: './withexclude/simple',
      output_folder: false
    };

    return NightwatchClient.runTests(settings);
  });

  it('testRun with exclude folder pattern and multiple src_folders', function() {
    const originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../sampletests/'));

    let srcFolders = ['./withexclude/excluded', './withexclude/simple'];
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results, cb) {
          assert.ok('excluded/excluded-module' in results.modules);
          assert.ok('excluded/not-excluded' in results.modules);
          assert.ok(!('simple/sample' in results.modules));
          process.chdir(originalCwd);

          cb();
        }
      },
      src_folders: srcFolders,
      exclude: './withexclude/simple/*',
      output_folder: false
    };

    return NightwatchClient.runTests(settings);
  });

  it('testRun with filter folder name and multiple src_folders', function() {
    const originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../sampletests/'));

    let srcFolders = ['./withexclude/excluded', './withexclude/simple'];
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok(!('excluded/not-excluded' in results.modules));
          assert.ok('simple/sample' in results.modules);
          process.chdir(originalCwd);

          cb();
        }
      },
      src_folders: srcFolders,
      filter: 'withexclude/simple',
      output_folder: false
    };

    return NightwatchClient.runTests(settings);
  });

  it('testRun with filter pattern and multiple src_folders', function() {
    const originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../sampletests/'));

    let srcFolders = ['./withexclude/excluded', './withexclude/simple'];
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok(!('excluded/not-excluded' in results.modules));
          assert.ok('simple/sample' in results.modules);
          process.chdir(originalCwd);

          cb();
        }
      },
      src_folders: srcFolders,
      filter: 'withexclude/simple/*',
      output_folder: false
    };

    return NightwatchClient.runTests(settings);
  });

  it('testRun with filter pattern relative and single src_folders', function() {
    const originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../sampletests/'));

    let srcFolders = ['./withexclude'];
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok(!('excluded/not-excluded' in results.modules));
          assert.ok('simple/sample' in results.modules);
          process.chdir(originalCwd);

          cb();
        }
      },
      src_folders: srcFolders,
      filter: 'simple/*',
      output_folder: false
    };

    return NightwatchClient.runTests(settings);
  });

  it('testRun with both filter and exclude patterns and single src_folder', function() {
    const originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../sampletests/'));

    let srcFolders = ['./withexclude'];
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok('excluded/not-excluded' in results.modules);
          assert.ok(!('simple/sample' in results.modules));
          process.chdir(originalCwd);

          cb();
        }
      },
      src_folders: srcFolders,
      filter: 'excluded/*',
      exclude: 'excluded/excluded-*',
      output_folder: false
    };

    return NightwatchClient.runTests(settings);
  });

  it('testRunWithExcludePattern', function() {
    const originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../sampletests/'));

    let testsPath = ['./withexclude'];
    let testPattern = ['withexclude/excluded/excluded-*'];

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok('excluded/not-excluded' in results.modules);
          assert.ok('simple/sample' in results.modules);
          process.chdir(originalCwd);

          cb();
        }
      },
      exclude: testPattern,
      output_folder: false,
      start_session: true
    };

    return NightwatchClient.runTests({
      _source: testsPath
    }, settings);
  });

  it('testRunWithExcludeFile', function() {
    const originalCwd = process.cwd();
    const testsPath = path.join(__dirname, '../../sampletests/withexclude');
    const testPattern = path.join('withexclude', 'excluded', 'excluded-module.js');

    process.chdir(path.join(__dirname, '../../sampletests/'));

    const settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok('excluded/not-excluded' in results.modules);
          assert.ok('simple/sample' in results.modules);
          process.chdir(originalCwd);
          cb();
        }
      },
      exclude: [testPattern],
      output_folder: false,
      start_session: true
    };

    return NightwatchClient.runTests({
      _source: [testsPath]
    }, settings);
  });
});