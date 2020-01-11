const assert = require('assert');
const path = require('path');
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

    return reporter.loadFile()
      .catch(err => {
        assert.ok(err instanceof Error);
        assert.equal(err.message, 'The custom reporter file name "unknown" cannot be resolved.')
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

    return reporter.loadFile()
      .catch(err => {
        assert.equal(err.message, 'The reporter module must have a public ".write()" method defined.')
      });
  });

  it('test with valid reporter', function() {

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
      assert.equal(result.length, 2);
    });
  });
});
