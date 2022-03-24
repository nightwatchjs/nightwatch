const assert = require('assert');
const path = require('path');
const common = require('../../common.js');
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

    return reporter.loadFile(reporter.reporterFile)
      .catch(err => {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message, 'The custom reporter file name "unknown" cannot be resolved.');
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

    return reporter.loadFile(reporter.reporterFile)
      .catch(err => {
        assert.strictEqual(err.message, 'The reporter module must have a public ".write()" method defined.');
      });
  });

  it('test with valid reporter', function() {

    const reporter = new Reporter(path.join(__dirname, '../../extra/reporter/custom.js'), {
      globals: {
        reporter(results, done) {
          done();
        }
      },
      output_folder: 'output'
    });

    reporter.writeReport = function(reporter, globalResults) {
      Promise.resolve();
    };

    return reporter.save().then(function(result) {
      assert.ok(Array.isArray(result));
      assert.strictEqual(result.length, 2);
    });
  });

  it('test with multiple reporters', function() {
    const reporter = new Reporter([path.join(__dirname, '../../extra/reporter/custom.js'), path.join(__dirname, '../../extra/reporter/custom.js')], {
      globals: {
        reporter(results, done) {
          done();
        }
      },
      output_folder: 'output'
    });

    reporter.writeReport = function(reporter, globalResults) {
      Promise.resolve();
    };

    return reporter.writeReportToFile({passed: true}).then((result) => {
      assert.ok(Array.isArray(result));
      assert.strictEqual(result.length, 3);
    });
  });
});
