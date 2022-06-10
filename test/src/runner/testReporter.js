const assert = require('assert');
const path = require('path');
const mockery = require('mockery');

const common = require('../../common.js');
const jsonReporter = require.resolve('../../../lib/reporter/reporters/json');
const junitReporter = require.resolve('../../../lib/reporter/reporters/junit');
const htmlReporter = require.resolve('../../../lib/reporter/reporters/html');
const Reporter = common.require('reporter/global-reporter.js');

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
    const reporter = new Reporter(path.join(__dirname, '../../extra/reporter/notvalid.js'), {
      globals: {
        reporter(results, done) {
          done();
        }
      },
      output_folder: 'output'
    });

    return reporter.loadReporter()
      .catch(err => {
        assert.strictEqual(err.message, 'The reporter module must have a public ".write(results, options, [callback])" method defined which should return a Promise.');
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
    mockery.registerMock(jsonReporter, {
      async write(results, options) {
        return 'json';
      }
    });
    mockery.registerMock(htmlReporter, {
      async write(results, options) {
        return 'html';
      }
    });
    mockery.registerMock(junitReporter, {
      async write(results, options) {
        return 'junit';
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
      assert.deepStrictEqual(result, ['junit', 'html', 'json', 'reporter_output']);
    });
  });
});
