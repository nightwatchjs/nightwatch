var assert = require('assert');
var path = require('path');
var common = require('../../common.js');
var Reporter = common.require('runner/reporter.js');

module.exports = {
  'testReporter' : {
    'test with unknown reporter' : function() {

      var reporter = new Reporter({}, {}, null, {
        reporter : 'unknown'
      });

      assert.throws(function() {
        reporter.get();
      });
    },

    'test with not valid reporter' : function() {

      var reporter = new Reporter({}, {}, null, {
        reporter : path.join(__dirname, '../../extra/reporter/notvalid.js')
      });

      assert.throws(function() {
        reporter.get();
      }, 'The reporter module must have a public `write` method defined.');
    },

    'test with valid reporter' : function(done) {

      var reporter = new Reporter({}, {}, null, {
        reporter : path.join(__dirname, '../../extra/reporter/custom.js'),
        output_folder : 'output'
      });

      reporter.save().then(function(err) {
        assert.equal(err, null);
        done();
      }).catch(function(err) {
        done(err);
      })
    }
  }
};