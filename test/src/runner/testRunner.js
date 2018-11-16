const path = require('path');
const fs = require('fs');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const Globals = require('../../lib/globals.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const Runner = common.require('runner/runner.js');
const Settings = common.require('settings/settings.js');
const NightwatchClient = common.require('index.js');

describe('testRunner', function() {
  before(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  it('testRunEmptyFolder', function(done) {
    let testsPath = path.join(__dirname, '../../sampletests/empty');

    Globals
      .startTestRunner(testsPath, {
        output_folder: false
      })
      .catch(err => {
        assert.ok(err instanceof Error);
        if (err.message !== `No tests defined! using source folder: ${testsPath}`) {
          done(err);
        } else {
          done();
        }
      });
  });

  it('testRunNoSrcFoldersArgument', function() {
    let settings = Settings.parse({
      output_folder: false
    });

    assert.throws(function() {
      Runner.readTestSource(settings);
    }, /No test source specified, please check configuration/)
  });

  it('testRunSimple', function() {
    let testsPath = path.join(__dirname, '../../sampletests/simple');
    let globals = {
      reporter(results) {
        assert.ok('test/sample' in results.modules);
        assert.ok('demoTest' in results.modules['test/sample'].completed);

        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output: false,
      persist_globals: true,
      globals: globals,
      output_folder: false
    });
  });

  it('testRunWithJUnitOutput', function() {
    let testsPath = [
      path.join(__dirname, '../../sampletests/withsubfolders')
    ];

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output_folder: 'output',
      silent: true,
      globals: {reporter: function() {}},
      output: false
    };

    return NightwatchClient.runTests(testsPath, settings)
      .then(_ => {
        return readDirPromise(testsPath[0]);
      })
      .then(list => {
        let simpleReportFile = 'output/simple/FIREFOX_TEST_TEST_sample.xml';
        let tagsReportFile = 'output/tags/FIREFOX_TEST_TEST_sampleTags.xml';

        assert.deepEqual(list, ['simple', 'tags'], 'The subfolders have not been created.');
        assert.ok(fileExistsSync(simpleReportFile), 'The simple report file was not created.');
        assert.ok(fileExistsSync(tagsReportFile), 'The tags report file was not created.');

        return readFilePromise(simpleReportFile);
      })
      .then(data => {
        let content = data.toString();
        assert.ok(/<testsuite[\s]+name="simple\.sample"[\s]+errors="0"[\s]+failures="0"[\s]+hostname=""[\s]+id=""[\s]+package="simple"[\s]+skipped="0"[\s]+tests="1"/.test(content),
          'Report does not contain correct testsuite information.');

        assert.ok(/<testcase[\s]+name="simpleDemoTest"[\s]+classname="simple\.sample"[\s]+time="[.\d]+"[\s]+assertions="1">/.test(content),
          'Report does not contain the correct testcase element.');
      });
  });
});

function readFilePromise(fileName) {
  return new Promise(function(resolve, reject) {
    fs.readFile(fileName, function(err, result) {
      if (err) {
        return reject(err);
      }

      resolve(result);
    });
  });
}

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
