const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

const originalCwd = process.cwd();

describe('testRunWithExclude', function() {
  before(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  beforeEach(function(done) {
    process.chdir(path.join(__dirname, '../../sampletests/'));
    done();
  });

  afterEach(function(done) {
    process.chdir(originalCwd);
    done();
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('testRunWithExcludeFolder', function() {
    return runTests({
      _source: ['./withexclude']
    }, settings({
      globals: {
        reporter(results, cb) {
          assert.ok(!(`excluded${path.sep}excluded-module` in results.modules));
          assert.ok(!(`excluded${path.sep}not-excluded` in results.modules));
          assert.ok(`simple${path.sep}sample` in results.modules);

          cb();
        }
      },
      exclude: ['./withexclude/excluded']
    }));
  });

  it('testRun with exclude folder name and multiple src_folders', function()  {
    return runTests(settings({
      globals: {
        reporter(results, cb) {
          assert.ok(`excluded${path.sep}excluded-module` in results.modules);
          assert.ok(`excluded${path.sep}not-excluded` in results.modules);
          assert.ok(!(`simple${path.sep}sample` in results.modules));

          cb();
        }
      },
      src_folders: ['./withexclude/excluded', './withexclude/simple'],
      exclude: './withexclude/simple'
    }));
  });

  it('testRun with exclude folder pattern and multiple src_folders', function()  {
    return runTests(settings({
      globals: {
        reporter(results, cb) {
          assert.ok(`excluded${path.sep}excluded-module` in results.modules);
          assert.ok(`excluded${path.sep}not-excluded` in results.modules);
          assert.ok(!(`simple${path.sep}sample` in results.modules));

          cb();
        }
      },
      src_folders: ['./withexclude/excluded', './withexclude/simple'],
      exclude: './withexclude/simple/*'
    }));
  });

  it('testRun with filter folder name and multiple src_folders', function()  {
    return runTests(settings({
      globals: {
        reporter(results, cb) {
          assert.ok(!(`excluded${path.sep}excluded-module` in results.modules));
          assert.ok(!(`excluded${path.sep}not-excluded` in results.modules));
          assert.ok(`simple${path.sep}sample` in results.modules);

          cb();
        }
      },
      src_folders: ['./withexclude/excluded', './withexclude/simple'],
      filter: 'withexclude/simple'
    }));
  });

  it('testRun with filter pattern and multiple src_folders', function()  {
    return runTests(settings({
      globals: {
        reporter(results, cb) {
          assert.ok(!(`excluded${path.sep}excluded-module` in results.modules));
          assert.ok(!(`excluded${path.sep}not-excluded` in results.modules));
          assert.ok(`simple${path.sep}sample` in results.modules);

          cb();
        }
      },
      src_folders: ['./withexclude/excluded', './withexclude/simple'],
      filter: 'withexclude/simple/*'
    }));
  });

  it('testRun with filter pattern relative and single src_folders', function()  {
    return runTests(settings({
      globals: {
        reporter(results, cb) {
          assert.ok(!(`excluded${path.sep}excluded-module` in results.modules));
          assert.ok(!(`excluded${path.sep}not-excluded` in results.modules));
          assert.ok(`simple${path.sep}sample` in results.modules);

          cb();
        }
      },
      src_folders: ['./withexclude'],
      filter: 'simple/*'
    }));
  });

  it('testRun with both filter and exclude patterns and single src_folder', function()  {
    return runTests(settings({
      globals: {
        reporter(results, cb) {
          assert.ok(!(`excluded${path.sep}excluded-module` in results.modules));
          assert.ok(`excluded${path.sep}not-excluded` in results.modules);
          assert.ok(!(`simple${path.sep}sample` in results.modules));

          cb();
        }
      },
      src_folders: ['./withexclude'],
      filter: 'excluded/*',
      exclude: 'excluded/excluded-*'
    }));
  });

  it('testRunWithExcludePattern', function()  {
    return runTests({
      _source: ['./withexclude']
    }, settings({
      globals: {
        reporter(results, cb) {
          assert.ok(!(`excluded${path.sep}excluded-module` in results.modules));
          assert.ok(`excluded${path.sep}not-excluded` in results.modules);
          assert.ok(`simple${path.sep}sample` in results.modules);

          cb();
        }
      },
      exclude: ['withexclude/excluded/excluded-*'],
      start_session: true
    }));
  });

  it('testRunWithExcludeFile', function()  {
    return runTests({
      _source: [path.join(__dirname, '../../sampletests/withexclude')]
    }, settings({
      globals: {
        reporter(results, cb) {
          assert.ok(!(`excluded${path.sep}excluded-module` in results.modules));
          assert.ok(`excluded${path.sep}not-excluded` in results.modules);
          assert.ok(`simple${path.sep}sample` in results.modules);
          cb();
        }
      },
      exclude: [path.join('withexclude', 'excluded', 'excluded-module.js')],
      start_session: true
    }));
  });

  it('test running with multiple excludes will exclude all matches with single src folder', function()  {
    return runTests(settings({
      globals: {
        reporter(results, cb) {
          assert.ok(!(`excluded${path.sep}excluded-module` in results.modules));
          assert.ok(`excluded${path.sep}not-excluded` in results.modules);
          assert.ok(!(`simple${path.sep}sample` in results.modules));

          cb();
        }
      },
      src_folders: './withexclude',
      exclude: [
        path.join('withexclude', 'excluded', 'excluded-module.js'),
        path.join('withexclude', 'simple')
      ]
    }));
  });

  it('test running with multiple excludes will exclude all matches with multiple src folders', function()  {
    return runTests(settings({
      globals: {
        reporter(results, cb) {
          assert.ok(!(`excluded${path.sep}excluded-module` in results.modules));
          assert.ok(`excluded${path.sep}not-excluded` in results.modules);
          assert.ok(!(`simple${path.sep}sample` in results.modules));

          cb();
        }
      },
      src_folders: [
        path.join('withexclude', 'excluded'),
        path.join('withexclude', 'simple')
      ],
      exclude: [
        path.join('withexclude', 'excluded', 'excluded-module.js'),
        path.join('withexclude', 'simple')
      ]
    }));
  });
});
