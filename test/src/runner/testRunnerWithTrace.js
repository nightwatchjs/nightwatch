const path = require('path');
const fs = require('fs');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const nocks = require('../../lib/nocks');
const rimraf = require('rimraf');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunnerWithTrace', function () {
  const snapshotFilePath = 'snapshots';
  const moduleName = 'sample';

  before(function(done) {
    nocks.enable().cleanAll();
    CommandGlobals.beforeEach.call(this,  function() {
      rimraf(snapshotFilePath, done);
    });
  });

  afterEach(function(done) {
    rimraf(snapshotFilePath, done);
  });

  after(function(done) {
    nocks.disable();
    CommandGlobals.afterEach.call(this, function() {
      rimraf(snapshotFilePath, done);
    });
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  it('takes snapshot for each traceable command', function () {
    this.timeout(5000);
    let testsPath = [
      path.join(__dirname, '../../sampletests/trace/sample.js')
    ];
    const pageHtml = '<!doctype html><html class="no-js" lang=""><head> <meta charset="utf-8"> <title></title> <meta name="description" content=""> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta property="og:title" content=""> <meta property="og:type" content=""> <meta property="og:url" content=""> <meta property="og:image" content=""> <link rel="manifest" href="site.webmanifest"> <link rel="apple-touch-icon" href="icon.png"> <link rel="stylesheet" href="css/normalize.css"> <link rel="stylesheet" href="css/main.css"> <meta name="theme-color" content="#fafafa"></head><body> <p>Hello world! This is HTML5 Boilerplate.</p><script src="js/vendor/modernizr-3.11.2.min.js"></script> <script src="js/plugins.js"></script> <script src="js/main.js"></script> <script>window.ga=function (){ga.q.push(arguments)}; ga.q=[]; ga.l=+new Date; ga(\'create\', \'UA-XXXXX-Y\', \'auto\'); ga(\'set\', \'anonymizeIp\', true); ga(\'set\', \'transport\', \'beacon\'); ga(\'send\', \'pageview\') </script> <script src="https://www.google-analytics.com/analytics.js" async></script></body></html>';
    const pageUrl = 'https://nightwatchjs.org';

    nocks.createSession()
      .url()
      .elementFound()
      .visible()
      .getUrl(pageUrl)
      .getPageSource(pageHtml)
      .elementFound()
      .click()
      .getUrl(pageUrl)
      .getPageSource(pageHtml)
      .deleteSession();

    return runTests(testsPath, settings({
      skip_testcases_on_fail: false,
      globals: {
        waitForConditionPollInterval: 5,
        waitForConditionTimeout: 5,
        retryAssertionTimeout: 1,
        reporter: function (results) {
          const snapshot1 = results.modulesWithEnv.default.sample.completedSections.click_on_web_login.commands[0].domSnapshot;
          const snapshot2 = results.modulesWithEnv.default.sample.completedSections.click_on_web_login.commands[1].domSnapshot;

          assert.ok(snapshot1.snapshotFilePath.includes(`snapshots${path.sep}sample${path.sep}navigateTo`));
          assert.strictEqual(snapshot1.snapshotUrl, 'https://nightwatchjs.org');

          assert.ok(snapshot2.snapshotFilePath.includes(`snapshots${path.sep}sample${path.sep}click`));
          assert.strictEqual(snapshot2.snapshotUrl, 'https://nightwatchjs.org');
        },
        abortOnAssertionFailure: false
      },
      trace: {
        enabled: true,
        path: snapshotFilePath
      }
    }))
      .then(_ => {
        return readDirPromise(`${snapshotFilePath}/${moduleName}`);
      })
      .then(files => {
        assert.ok(Array.isArray(files));
        assert.strictEqual(files.length, 2);
        files.forEach((val) => assert.ok(val.endsWith('.html')));
      });
  });

  it('error while taking snapshot', function () {
    let testsPath = [
      path.join(__dirname, '../../sampletests/trace/sample.js')
    ];

    const pageUrl = 'https://nightwatchjs.org';

    nocks.createSession()
      .url()
      .elementFound()
      .visible()
      .getUrl(pageUrl)
      .elementFound()
      .click()
      .getUrl(pageUrl)
      .deleteSession();

    return runTests(testsPath, settings({
      skip_testcases_on_fail: false,
      globals: {
        waitForConditionPollInterval: 5,
        waitForConditionTimeout: 5,
        retryAssertionTimeout: 1,
        reporter: function (results) {
          assert.ok(results);

          const snapshot1 = results.modulesWithEnv.default.sample.completedSections.click_on_web_login.commands[0].domSnapshot;
          const snapshot2 = results.modulesWithEnv.default.sample.completedSections.click_on_web_login.commands[1].domSnapshot;

          assert.equal(snapshot1.error, 'failed to fetch pageSource');
          assert.strictEqual(snapshot2.error, 'failed to fetch pageSource');
        },
        abortOnAssertionFailure: false
      },
      trace: {
        enabled: true,
        path: snapshotFilePath
      }
    }))
      .then(_ => {
        return readDirPromise(`${snapshotFilePath}/${moduleName}`);
      })
      .then(_ => {
        assert.fail();
      })
      .catch(err => {
        assert.ok(err);
        assert.strictEqual(err.code, 'ENOENT');
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