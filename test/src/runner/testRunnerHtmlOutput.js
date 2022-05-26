const path = require('path');
const fs = require('fs');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunnerHTMLOutput', function() {
  const emptyPath = path.join(__dirname, '../../sampletests/empty/testdir');

  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      fs.mkdir(emptyPath, function(err) {
        if (err) {
          return done();
        }
        done();
      });
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, function() {
      fs.rmdir(emptyPath, function(err) {
        if (err) {
          return done();
        }
        done();
      });
    });
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  it('test run screenshots with html output and test failures', function () {

    const testsPath = [
      path.join(__dirname, '../../sampletests/withfailures')
    ];

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/screenshot',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 'screendata'
      })
    }, true);


    return runTests({source: testsPath, reporter: 'html'}, settings({
      output_folder: 'output',
      globals: {
        waitForConditionPollInterval: 20,
        waitForConditionTimeout: 50,
        retryAssertionTimeout: 50,
        reporter: function () {
        }
      },
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: true,
        path: ''
      }
    }))
      .then(_ => {
        return readFilePromise(`output${path.sep}reporter.html`);
      }).
      then(_ => {
        return Promise.all([readDirPromise(`output${path.sep}js`), 
          readDirPromise(`output${path.sep}css`), 
          readDirPromise(`output${path.sep}images`)]);
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
