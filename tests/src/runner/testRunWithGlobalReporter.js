var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var path = require('path');

module.exports = {
  setUp: function (cb) {
    this.Runner = require('../../../' + BASE_PATH + '/runner/run.js');
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    cb();
  },

  tearDown: function (callback) {
    delete require.cache[require.resolve('../../../' + BASE_PATH + '/runner/run.js')];
    callback();
  },

  testRunWithGlobalReporter : function(test) {
    test.expect(22);
    var testsPath = path.join(process.cwd(), '/sampletests/before-after');
    var reporterCount = 0;
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test,
        reporter: function(results) {
          test.ok('modules' in results);
          reporterCount++;
        }
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(err, null);
      test.equals(reporterCount, 1);
      test.done();
    });
  },

  testRunWithGlobalAsyncReporter : function(test) {
    test.expect(22);
    var testsPath = path.join(process.cwd(), '/sampletests/before-after');
    var reporterCount = 0;
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test,
        reporter: function(results, done) {
          test.ok('modules' in results);
          reporterCount++;
          done();
        }
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(err, null);
      test.equals(reporterCount, 1);
      test.done();
    });
  }
};
