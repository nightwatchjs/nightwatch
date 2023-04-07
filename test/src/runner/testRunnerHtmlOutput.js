const path = require('path');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');
const {readFilePromise} = require('../../lib/utils.js');
const rimraf = require('rimraf');
const assert = require('assert');
const HtmlReporter = common.require('reporter/reporters/html.js');
const {mkpath} = common.require('utils');
const reportObject = require('../../extra/reportObject');

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

  it('test Html Reporter output', function () {
    const options = {
      output_folder: outputPath
    };

    const adaptedResults = HtmlReporter.adaptResults(reportObject, options);

    assert.ok(adaptedResults);
    
    const environments = adaptedResults.environments ;
    const metadata = adaptedResults.metadata ;
    const stats = adaptedResults.stats ;
    assert.ok(environments);
    assert.ok(metadata);
    assert.ok(stats);

    assert.strictEqual(Object.keys(environments).length, 2);
    assert.ok(metadata.date);
    assert.strictEqual(stats.total, 22);
    assert.strictEqual(stats.failed, 3);
    assert.strictEqual(stats.skipped, 2);
    assert.strictEqual(stats.passed, 17);

    const chromeEnv = environments['chrome'];
    const firefoxEnv = environments['firefox'];

    assert.ok(chromeEnv);
    assert.strictEqual(chromeEnv.stats.passed, 10);
    assert.strictEqual(chromeEnv.stats.failed, 1);
    assert.strictEqual(chromeEnv.stats.skipped, 0);
    assert.strictEqual(chromeEnv.stats.time, 79681);
    assert.strictEqual(chromeEnv.metadata.platformName, 'mac os x');
    assert.strictEqual(chromeEnv.metadata.browserName, 'chrome');
    assert.strictEqual(chromeEnv.metadata.browserVersion, '111.0.5563.146');
    assert.strictEqual(chromeEnv.metadata.device, 'desktop');
    assert.strictEqual(chromeEnv.metadata.executionMode, 'local');

    assert.ok(firefoxEnv);
    assert.strictEqual(firefoxEnv.stats.passed, 7);
    assert.strictEqual(firefoxEnv.stats.failed, 2);
    assert.strictEqual(firefoxEnv.stats.skipped, 2);
    assert.strictEqual(firefoxEnv.stats.time, 70498);
    assert.strictEqual(firefoxEnv.metadata.platformName, 'mac');
    assert.strictEqual(firefoxEnv.metadata.browserName, 'firefox');
    assert.strictEqual(firefoxEnv.metadata.browserVersion, '111.0.1');
    assert.strictEqual(firefoxEnv.metadata.device, 'desktop');
    assert.strictEqual(firefoxEnv.metadata.executionMode, 'local');
    
    assert.strictEqual(stats.time, 94000);

    assert.strictEqual(Object.keys(chromeEnv.modules).length, 10);
    assert.strictEqual(Object.keys(chromeEnv.modules['ecosia'].completedSections).length, 5);
    assert.strictEqual(chromeEnv.modules['ecosia'].seleniumLog, '/Users/vaibhavsingh/Dev/nightwatch/logs/ecosia_chromedriver.log');

    const demoTestPass = chromeEnv.modules['ecosia'].completedSections['Demo test ecosia.org'];

    assert.ok(demoTestPass);
    assert.strictEqual(demoTestPass.commands.length, 7);
    assert.strictEqual(demoTestPass.status, 'pass');

    const demoTestFail = firefoxEnv.modules['chromeCDP_example'].completedSections['using CDP DOM Snapshot'];
    assert.ok(demoTestFail);
    assert.strictEqual(demoTestFail.commands.length, 4);
    assert.strictEqual(demoTestFail.status, 'fail');

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
        reporter: function (result) {
          const failedTest = result.modulesWithEnv.default.sample.completedSections.demoTest.commands[2];
          assert.ok(failedTest.screenshot && failedTest.screenshot.includes(`sample${path.sep}demoTest`));
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
      });
  });

  it('test html report folder with a folder format function', function () {

    const testsPath = [
      path.join(__dirname, '../../sampletests/withfailures')
    ];

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/screenshot',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: '<faketag>fakedata'
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
      reporter_options: {
        folder_format: function() {
          return Date.now().toString();
        }
      }
    }))
      .then(_ => {
        return readFilePromise(`${outputPath}${path.sep}*${path.sep}nightwatch-html-report${path.sep}index.html`);
      }).
      then(_ => {
      });
  });

  it('test html report file with a file format function', function () {

    const testsPath = [
      path.join(__dirname, '../../sampletests/withfailures')
    ];

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/screenshot',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: '<faketag>fakedata'
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
      reporter_options: {
        filename_format: function() {
          return 'test_report';
        }
      }
    }))
      .then(_ => {
        return readFilePromise(`${outputPath}${path.sep}nightwatch-html-report${path.sep}test_report.html`);
      }).
      then(_ => {
      }).catch((err) => {
        console.log(err);
      });
  });
});
