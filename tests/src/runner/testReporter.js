var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Reporter = require('../../../'+ BASE_PATH +'/runner/reporter.js');

module.exports = {
  'test with unknown reporter' : function(test) {

    var reporter = new Reporter({}, {}, null, {
      reporter : 'unknown'
    });

    test.throws(function() {
      reporter.get();
    });

    test.done();
  },

  'test with not valid reporter' : function(test) {

    var reporter = new Reporter({}, {}, null, {
      reporter : './extra/reporter/notvalid.js'
    });

    test.throws(function() {
      reporter.get();
    }, 'The reporter module must have a public `write` method defined.');

    test.done();
  },

  'test with valid reporter' : function(test) {

    var reporter = new Reporter({}, {}, null, {
      reporter : './extra/reporter/custom.js',
      output_folder : 'output'
    });
    test.expect(1);
    reporter.save().then(function() {
      test.ok('Report saved');
      test.done();
    });
  }
};