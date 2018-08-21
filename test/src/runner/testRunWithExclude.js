const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

const originalCwd = process.cwd();
const defaultSettings = {
  selenium: {
    port: 10195,
    version2: true,
    start_process: true
  },
  silent: true,
  output: false,
  output_folder: false,
};

describe('testRunWithExclude', () => {
  before((done) => {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  beforeEach((done) => {
    process.chdir(path.join(__dirname, '../../sampletests/'));
    done();
  });

  afterEach((done) => {
    process.chdir(originalCwd);
    done();
  });

  after((done) => {
    CommandGlobals.afterEach.call(this, done);
  });

  it('testRunWithExcludeFolder', () => {
    const settings = Object.assign({
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok(!('excluded/not-excluded' in results.modules));
          assert.ok('simple/sample' in results.modules);

          cb();
        },
      },
      exclude: ['./withexclude/excluded'],
    }, defaultSettings);

    return NightwatchClient.runTests({
      _source: ['./withexclude']
    }, settings);
  });

  it('testRun with exclude folder name and multiple src_folders', () => {
    const settings = Object.assign({
      globals: {
        reporter(results, cb) {
          assert.ok('excluded/excluded-module' in results.modules);
          assert.ok('excluded/not-excluded' in results.modules);
          assert.ok(!('simple/sample' in results.modules));

          cb();
        }
      },
      src_folders: ['./withexclude/excluded', './withexclude/simple'],
      exclude: './withexclude/simple',
    }, defaultSettings);

    return NightwatchClient.runTests(settings);
  });

  it('testRun with exclude folder pattern and multiple src_folders', () => {
    const settings = Object.assign({
      globals: {
        reporter(results, cb) {
          assert.ok('excluded/excluded-module' in results.modules);
          assert.ok('excluded/not-excluded' in results.modules);
          assert.ok(!('simple/sample' in results.modules));

          cb();
        }
      },
      src_folders: ['./withexclude/excluded', './withexclude/simple'],
      exclude: './withexclude/simple/*',
    }, defaultSettings);

    return NightwatchClient.runTests(settings);
  });

  it('testRun with filter folder name and multiple src_folders', () => {
    const settings = Object.assign({
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok(!('excluded/not-excluded' in results.modules));
          assert.ok('simple/sample' in results.modules);

          cb();
        }
      },
      src_folders: ['./withexclude/excluded', './withexclude/simple'],
      filter: 'withexclude/simple',
    }, defaultSettings);

    return NightwatchClient.runTests(settings);
  });

  it('testRun with filter pattern and multiple src_folders', () => {
    const settings = Object.assign({
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok(!('excluded/not-excluded' in results.modules));
          assert.ok('simple/sample' in results.modules);

          cb();
        }
      },
      src_folders: ['./withexclude/excluded', './withexclude/simple'],
      filter: 'withexclude/simple/*',
    }, defaultSettings);

    return NightwatchClient.runTests(settings);
  });

  it('testRun with filter pattern relative and single src_folders', () => {
    const settings = Object.assign({
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok(!('excluded/not-excluded' in results.modules));
          assert.ok('simple/sample' in results.modules);

          cb();
        }
      },
      src_folders: ['./withexclude'],
      filter: 'simple/*',
    }, defaultSettings);

    return NightwatchClient.runTests(settings);
  });

  it('testRun with both filter and exclude patterns and single src_folder', () => {
    const settings = Object.assign({
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok('excluded/not-excluded' in results.modules);
          assert.ok(!('simple/sample' in results.modules));

          cb();
        }
      },
      src_folders: ['./withexclude'],
      filter: 'excluded/*',
      exclude: 'excluded/excluded-*',
    }, defaultSettings);

    return NightwatchClient.runTests(settings);
  });

  it('testRunWithExcludePattern', () => {
    const settings = Object.assign({
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok('excluded/not-excluded' in results.modules);
          assert.ok('simple/sample' in results.modules);

          cb();
        }
      },
      exclude: ['withexclude/excluded/excluded-*'],
      start_session: true,
    }, defaultSettings);

    return NightwatchClient.runTests({
      _source: ['./withexclude']
    }, settings);
  });

  it('testRunWithExcludeFile', () => {
    const settings = Object.assign({
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok('excluded/not-excluded' in results.modules);
          assert.ok('simple/sample' in results.modules);
          cb();
        }
      },
      exclude: [path.join('withexclude', 'excluded', 'excluded-module.js')],
      start_session: true,
    }, defaultSettings);

    return NightwatchClient.runTests({
      _source: [path.join(__dirname, '../../sampletests/withexclude')]
    }, settings);
  });

  it('test running with multiple excludes will exclude all matches with single src folder', () => {
    const settings = Object.assign({
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok('excluded/not-excluded' in results.modules);
          assert.ok(!('simple/sample' in results.modules));

          cb();
        }
      },
      src_folders: './withexclude',
      exclude: [
        path.join('withexclude', 'excluded', 'excluded-module.js'),
        path.join('withexclude', 'simple'),
      ],
    }, defaultSettings);

    return NightwatchClient.runTests(settings);
  });

  it('test running with multiple excludes will exclude all matches with multiple src folders', () => {
    const settings = Object.assign({
      globals: {
        reporter(results, cb) {
          assert.ok(!('excluded/excluded-module' in results.modules));
          assert.ok('excluded/not-excluded' in results.modules);
          assert.ok(!('simple/sample' in results.modules));

          cb();
        }
      },
      src_folders: [
        path.join('withexclude', 'excluded'),
        path.join('withexclude', 'simple'),
      ],
      exclude: [
        path.join('withexclude', 'excluded', 'excluded-module.js'),
        path.join('withexclude', 'simple'),
      ],
    }, defaultSettings);

    return NightwatchClient.runTests(settings);
  });
});
