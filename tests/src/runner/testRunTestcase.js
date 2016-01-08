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

  testRunNoSkipTestcasesOnFail : function(test) {
    test.expect(11);
    var testsPath = path.join(process.cwd(), '/sampletests/withfailures');
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      skip_testcases_on_fail: false,
      globals : {
        test : test
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(results.passed, 2);
      test.equals(results.failed, 2);
      test.equals(results.errors, 0);
      test.equals(results.skipped, 0);
      test.equals(err, null);
      test.done();
    });
  },

  testRunSkipTestcasesOnFail : function(test) {
    test.expect(9);
    var testsPath = path.join(process.cwd(), '/sampletests/withfailures');
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(results.passed, 1);
      test.equals(results.failed, 1);
      test.equals(results.errors, 0);
      test.equals(results.modules.sample.skipped[0], 'demoTest2');
      test.equals(err, null);
      test.done();
    });
  },

  testRunTestcase : function(test) {
    var testsPath = path.join(process.cwd(), '/sampletests/before-after/syncBeforeAndAfter.js');

    this.Runner.run(testsPath, {
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false,
      start_session : true,
      testcase : 'demoTestSyncOne'
    }, function(err, results) {
      test.equals(err, null);
      test.ok('demoTestSyncOne' in results.modules.syncBeforeAndAfter.completed);
      test.ok(!('demoTestSyncTwo' in results.modules.syncBeforeAndAfter.completed));

      test.done();
    });
  },

  testRunTestcaseInvalid : function(test) {
    var testsPath = path.join(process.cwd(), '/sampletests/before-after/syncBeforeAndAfter.js');

    this.Runner.run(testsPath, {
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false,
      start_session : true,
      testcase : 'Unknown'
    }, function(err, results) {
      test.equals(err.message, 'Error: "Unknown" is not a valid testcase in the current test suite.');

      test.done();
    });
  },

  testRunCurrentTestName : function(test) {
    test.expect(11);
    var testsPath = path.join(process.cwd(), '/sampletests/before-after/sampleSingleTest.js');
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test,
        beforeEach: function(client, done) {
          test.equal(client.currentTest.name, '');
          test.equal(client.currentTest.group, '');
          test.equal(client.currentTest.module, 'sampleSingleTest');
          done();
        },
        afterEach: function(client, done) {
          test.equal(client.currentTest.name, null);
          test.equal(client.currentTest.module, 'sampleSingleTest');
          done();
        }
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(err, null);
      test.done();
    });
  },

  testRunCurrentTestInAfterEach : function(test) {
    var testsPath = path.join(process.cwd(), '/sampletests/withaftereach/sampleSingleTest.js');
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(err, null);
      test.done();
    });
  },

  testRunRetries : function(test) {
    test.expect(11);
    var testsPath = path.join(process.cwd(), '/sampletests/withfailures');
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false,
      start_session : true,
      retries: 1
    }, function(err, results) {
      test.equals(results.passed, 1);
      test.equals(results.failed, 1);
      test.equals(results.errors, 0);
      test.equals(results.skipped, 0);
      test.equals(err, null);
      test.done();
    });
  },

  testRunRetriesNoSkipTestcasesOnFail : function(test) {
    test.expect(15);
    var testsPath = path.join(process.cwd(), '/sampletests/withfailures');
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      skip_testcases_on_fail: false,
      globals : {
        test : test
      }
    }, {
      output_folder : false,
      start_session : true,
      retries: 1
    }, function(err, results) {
      test.equals(results.passed, 2);
      test.equals(results.failed, 2);
      test.equals(results.errors, 0);
      test.equals(results.skipped, 0);
      test.equals(err, null);
      test.done();
    });
  }
};
