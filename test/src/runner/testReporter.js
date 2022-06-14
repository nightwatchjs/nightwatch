const assert = require('assert');
const path = require('path');
const mockery = require('mockery');
const mkpath = require('mkpath');
const rimraf = require('rimraf');

const common = require('../../common.js');
const {settings} = common;
const {runTests} = common.require('index.js');
const {readFilePromise, readDirPromise} = require('../../lib/utils.js');

const MockServer = require('../../lib/mockserver.js');
const Reporter = common.require('reporter/global-reporter.js');

describe('testReporter', function() {

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

  // afterEach(function(done) {
  //   rimraf('output', done);
  // });

  after(function(done) {
    this.server.close(function() {
      done();
    });
  });

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

  it('test run tests with multiple reporters - html + junit', async function () {
    let possibleError = null;
    const testsPath = [path.join(__dirname, '../../sampletests/simple/test/sample.js')];

    try {
      await runTests({
        source: testsPath,
        reporter: ['html', 'junit']
      },
      settings({
        output_folder: 'output',
        globals: {
          waitForConditionPollInterval: 20,
          waitForConditionTimeout: 50,
          retryAssertionTimeout: 50,
          reporter: function () {}
        },
        output: false
      }));

      await readFilePromise(`output${path.sep}FIREFOX_TEST_firefox__sample.xml`);
      await readDirPromise(`output${path.sep}nightwatch-html-report`);
    } catch (error) {
      possibleError = error;
    }

    assert.strictEqual(possibleError, null);
  });

  it('test run tests with default reporters', async function () {
    let possibleError = null;
    const testsPath = [path.join(__dirname, '../../sampletests/simple/test/sample.js')];

    try {
      await runTests({
        source: testsPath
      },
      settings({
        output_folder: 'output',
        globals: {
          waitForConditionPollInterval: 20,
          waitForConditionTimeout: 50,
          retryAssertionTimeout: 50,
          reporter: function () {}
        },
        silent: true,
        output: false
      }));

      await readFilePromise(`output${path.sep}FIREFOX_TEST_firefox__sample.xml`);
      await readFilePromise(`output${path.sep}FIREFOX_TEST_firefox__sample.json`);
      await readDirPromise(`output${path.sep}nightwatch-html-report`);
    } catch (error) {
      possibleError = error;
    }

    assert.strictEqual(possibleError, null);
  });
});
