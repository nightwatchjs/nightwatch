const assert = require('assert');
const path = require('path');
const mockery = require('mockery');

const common = require('../../common.js');
const Reporter = common.require('reporter/global-reporter.js');

describe('testReporter', function() {

  it('test with unknown reporter', function() {
    let reporter = new Reporter('unknown', {
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
    let reporter = new Reporter(path.join(__dirname, '../../extra/reporter/notvalid.js'), {
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

    let reporter = new Reporter(path.join(__dirname, '../../extra/reporter/custom.js'), {
      globals: {
        reporter(results, done) {
          done();
        }
      },
      output_folder: 'output'
    });

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

    let reporter = new Reporter('nightwatch_reporter', {
      globals: {
        reporter(results, done) {
          done();
        }
      },
      output_folder: 'output'
    });

    return reporter.writeReportToFile().then(function(result) {
      assert.strictEqual(result, 'reporter_output');
    });
  });
});
