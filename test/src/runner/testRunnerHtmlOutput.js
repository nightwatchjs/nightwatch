const path = require('path');
const fs = require('fs');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const {settings} = common;
const {runTests} = common.require('index.js');
const {readFilePromise, readDirPromise} = require('../../lib/utils');

describe('testRunnerHTMLOutput', function() {
  const outputPath = path.join(__dirname, '../../sampletests/test_output');

  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      fs.mkdir(outputPath, function(err) {
        if (err) {
          return done(err);
        }
        done();
      });
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, function() {
      fs.rm(outputPath, {recursive: true}, function(err) {
        if (err) {
          return done(err);
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
      output_folder: outputPath,
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
        return readFilePromise(`${outputPath}${path.sep}nightwatch-html-report${path.sep}index.html`);
      }).
      then(_ => {
        return Promise.all([readDirPromise(`${outputPath}${path.sep}nightwatch-html-report${path.sep}js`), 
          readDirPromise(`${outputPath}${path.sep}nightwatch-html-report${path.sep}css`), 
          readDirPromise(`${outputPath}${path.sep}nightwatch-html-report${path.sep}images`)]);
      });
     
  });
});
