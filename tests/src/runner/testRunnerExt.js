var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';

var simpleSampleTest = require('../../sampletests/usexpath/sample');
var path = require('path');

module.exports = {
  setUp: function(cb) {
    this.Runner = require('../../../' + BASE_PATH + '/runner/run.js');
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    cb();
  },

  tearDown: function(callback) {
    delete require.cache[require.resolve('../../../' + BASE_PATH + '/runner/run.js')];
    callback();
  },

  testRunModule: function(test) {

    //console.log(simpleSampleTest);

    var opts = {
      seleniumPort: 10195,
      silent: true,
      output: false,
      globals: {
        test: test
      }
    };

    this.Runner.init(opts, {
      output_folder: false
    }, function(err, results) {

      test.equals(err, null);
      test.ok('demoTest' in results.modules);
      test.ok('demoTestXpath' in results.modules.demoTest);
      test.done();
    });

    var moduleCallback = this.Runner.moduleCallback;

    this.Runner.runModule(simpleSampleTest, opts, 'test module name', 'demoTest', function(err, modulekeys) {
      return moduleCallback(err, modulekeys, []);
    });

  }
};
