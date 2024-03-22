const path = require('path');
const fs = require('fs');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const rimraf = require('rimraf');
const {settings} = common;
const {runTests} = common.require('index.js');
const {mkpath} = common.require('utils');

describe('testRunnerJsonOutput', function() {
  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => done());
  });

  beforeEach(function(done) {
    mkpath('output', function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  afterEach(function(done) {
    rimraf('output', done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('testRunWithJsonOutput', function() {
    let testsPath = [
      path.join(__dirname, '../../sampletests/withsubfolders')
    ];

    return runTests({source: testsPath, reporter: 'json'}, settings({
      output_folder: 'output',
      silent: true,
      globals: {reporter: function() {}}
    }))
      .then(_ => {
        return readDirPromise(testsPath[0]);
      })
      .then(list => {
        let simpleReportFile = path.resolve('output/simple/FIREFOX_TEST_firefox__sample.json');
        let tagsReportFile = path.resolve('output/tags/FIREFOX_TEST_firefox__sampleTags.json');

        assert.deepStrictEqual(list, ['simple', 'tags'], 'The subfolders have not been created.');
        assert.ok(fileExistsSync(simpleReportFile), 'The simple report file was not created.');
        assert.ok(fileExistsSync(tagsReportFile), 'The tags report file was not created.');

        return require(simpleReportFile);
      })
      .then(data => {
        assert.strictEqual(typeof data.report, 'object');
        assert.strictEqual(data.report.reportPrefix, 'FIREFOX_TEST_firefox__');
        assert.strictEqual(data.report.assertionsCount, 1);
        assert.strictEqual(data.report.failedCount, 0);
        assert.strictEqual(data.report.errorsCount, 0);
        assert.strictEqual(data.report.passedCount, 1);
        assert.strictEqual(data.report.tests, 1);
        assert.strictEqual(data.report.errmessages.length, 0);
        assert.strictEqual(Object.keys(data.report.completed)[0], 'simpleDemoTest');
        assert.strictEqual(data.name, 'sample');
        assert.strictEqual(Array.isArray(data.httpOutput), true);

        assert.strictEqual(data.report.modulePath.endsWith(path.join(
          'test', 'sampletests', 'withsubfolders', 'simple', 'sample.js'
        )), true);
      });
  });
});

function readDirPromise(dirName) {
  return new Promise(function(resolve, reject) {
    fs.readdir(dirName, function(err, result) {
      if (err) {
        return reject(err);
      }

      resolve(result);
    });
  });
}

// util to replace deprecated fs.existsSync
function fileExistsSync(path) {
  try {
    fs.statSync(path);

    return true;
  } catch (e) {
    return false;
  }
}
