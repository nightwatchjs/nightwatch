var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var path = require('path');

module.exports = {
  setUp : function(cb) {
    this.Runner = require('../../../'+ BASE_PATH +'/runner/run.js');
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    cb();
  },

  tearDown : function(callback) {
    delete require.cache[require.resolve('../../../'+ BASE_PATH +'/runner/run.js')];
    callback();
  },

  testLiveUpdateFlag : function(test) {
    test.expect(6);
    var testsPath = path.join(process.cwd(), '/sampletests/simple');
    var options = {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      },
      live_output: false
    };
    this.Runner.run([testsPath], options, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(err, null);
      test.ok('sample' in results.modules);
      test.ok('demoTest' in results.modules.sample.completed);
      test.equals(options.live_output, false);
      test.done();
    });
  },

  testLiveUpdateOverrideFlag : function(test) {
    test.expect(6);
    var testsPath = path.join(process.cwd(), '/sampletests/simple');
    var options = {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      },
      live_output: false
    };
    this.Runner.run([testsPath], options, {
      live_output : true,
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(err, null);
      test.ok('sample' in results.modules);
      test.ok('demoTest' in results.modules.sample.completed);
      test.equals(options.live_output, true);
      test.done();
    });
  }
};
