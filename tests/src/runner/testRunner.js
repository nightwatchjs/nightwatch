var Runner = require('../../../runner/run.js');

module.exports = {
  setUp: function (callback) {
    process.on('exit', function(code) {
      process.exit(0);
    });
    callback();
  },

  testRunEmptyFolder : function(test) {
    Runner.run([process.cwd() + '/sampletests/empty'], {
    }, {
      output_folder : false
    }, function(err) {
      test.ok(err.message.indexOf('No tests defined!') == 0);
      test.done();
    });
  },

  testRunSimple : function(test) {
    Runner.run([process.cwd() + '/sampletests/simple'], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false
    }, function(err, results) {
      test.equals(err, null);
      test.ok('sample' in results.modules);
      test.ok('demoTest' in results.modules.sample);
      test.done();
    });
  },

  testRunAsync : function(test) {
    test.expect(5);

    Runner.run([process.cwd() + '/sampletests/async'], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false
    }, function(err, results) {
      test.equals(err, null);
      test.ok('sample' in results.modules);
      test.ok('demoTestAsync' in results.modules.sample);
      test.done();
    });
  },

  testRunMixed : function(test) {
    test.expect(4);

    Runner.run([process.cwd() + '/sampletests/mixed'], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false
    }, function(err, results) {
      test.equals(err, null);
      test.ok('sample' in results.modules);
      test.ok('demoTestMixed' in results.modules.sample);
      test.done();
    });
  },

  tearDown : function(callback) {
    // clean up
    callback();
  }
};
