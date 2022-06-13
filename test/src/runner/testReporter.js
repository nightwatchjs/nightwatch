const assert = require('assert');
const path = require('path');
const mockery = require('mockery');

const common = require('../../common.js');
const jsonReporter = require.resolve('../../../lib/reporter/reporters/json');
const junitReporter = require.resolve('../../../lib/reporter/reporters/junit');
const htmlReporter = require.resolve('../../../lib/reporter/reporters/html');
const Reporter = common.require('reporter/global-reporter.js');
const {settings} = common;
const {runTests} = common.require('index.js');
const {readFilePromise, readDirPromise} = require('../../lib/utils');

describe('testReporter', function() {

  it('test with unknown reporter', function() {
    const reporter = new Reporter('unknown', {
      globals: {
        reporter(results, done) {
          done();
        }
      },
      output_folder: 'output'
    });

    return reporter.loadReporter()
      .catch(err => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, 'The custom reporter "unknown" cannot be resolved.');
      });
  });

  it('test with invalid reporter', function() {
    const custom_reporter = path.join(__dirname, '../../extra/reporter/notvalid.js');
    const reporter = new Reporter(custom_reporter, {
      globals: {
        reporter(results, done) {
          done();
        }
      },
      output_folder: 'output'
    });

    return reporter.loadReporter()
      .catch(err => {
        assert.strictEqual(err.message, `The custom reporter "${custom_reporter}" must have a public ".write(results, options, [callback])" method defined which should return a Promise.`);
      });
  });

  it('test with valid reporter file name', function() {

    const reporter = new Reporter(path.join(__dirname, '../../extra/reporter/custom.js'), {
      globals: {
        reporter(results, done) {
          done();
        }
      },
      output_folder: 'output'
    });

    reporter.writeReport = function (reporter, globalResults) {
      Promise.resolve();
    };

    return reporter.save().then(function(result) {
      assert.ok(Array.isArray(result));
      assert.strictEqual(result.length, 2);
    });
  });

  it('test with valid reporter from NPM', function() {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mockery.registerMock('nightwatch_reporter', {
      async write(results, options) {

        return 'reporter_output';
      }
    });

    const reporter = new Reporter('nightwatch_reporter', {
      globals: {
        reporter(results, done) {
          done();
        }
      },
      output_folder: 'output'
    });

    return reporter.writeReportToFile().then(function(result) {
      assert.deepStrictEqual(result, ['reporter_output']);
    });
  });

  it('test run tests with multiple reporters - html, junit, json', function () {
    const testsPath = [path.join(__dirname, '../../sampletests/simple/test/sample.js')];

    return runTests(
      {source: testsPath, reporter: ['html', 'junit']},
      settings({
        output_folder: 'output',
        globals: {
          waitForConditionPollInterval: 20,
          waitForConditionTimeout: 50,
          retryAssertionTimeout: 50,
          reporter: function () {}
        },
        output: false
      })
    )
      .then((_) => {
        readFilePromise(`output${path.sep}sample.json`);
        readFilePromise(`output${path.sep}sample.xml`);
        readDirPromise(`output${path.sep}nightwatch-html-report`);
      }).catch((err) => {
        console.error(err);
      });
  });
});
