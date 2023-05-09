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

describe('testRunnerRerunJsonOutput', function() {
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

  it('testRunWithRerunJsonOutput', function() {
    const testsPath = [
      path.join(__dirname, '../../sampletests/withsubfolders')
    ];

    return runTests({source: testsPath, reporter: 'rerunJson'}, settings({
      output_folder: 'output',
      silent: true,
      globals: {reporter: function() {}}
    }))
      .then(_ => {
        return readDirPromise(testsPath[0]);
      })
      .then(list => {
        const rerunJsonReportFile = path.resolve('output/test_results.json');
        assert.ok(fileExistsSync(rerunJsonReportFile), 'The simple report file was not created.');

        return require(rerunJsonReportFile);
      })
      .then(data => {
        assert.strictEqual(typeof data.modules, 'object');
        Object.keys(data.modules).forEach((moduleKey) => {
          const module = data.modules[moduleKey];
      
          assert.ok(Object.keys(module).includes('modulePath'));
          assert.ok(Object.keys(module).includes('status'));
        });
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
