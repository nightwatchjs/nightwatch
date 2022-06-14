const path = require('path');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');

const {settings} = common;
const {runTests} = common.require('index.js');
const {readFilePromise, readDirPromise} = require('../../lib/utils.js');
const mkpath = require('mkpath');
const rimraf = require('rimraf');

describe('testRunnerHTMLOutput', function() {
  const outputPath = 'output';

  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => done());
  });

  beforeEach(function(done) {
    mkpath(outputPath, done);
  });

  afterEach(function(done) {
    rimraf(outputPath, done);
  });

  after(function(done) {
    this.server.close(function() {
      done();
    });
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
