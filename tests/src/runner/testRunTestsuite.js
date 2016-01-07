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

  testRunSuiteRetries : function(test) {
    test.expect(14);
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
      suite_retries: 1
    }, function(err, results) {
      test.deepEqual(results.errmessages, []);
      test.equals(results.passed, 1);
      test.equals(results.failed, 1);
      test.equals(results.errors, 0);
      test.equals(results.skipped, 0);
      test.equals(err, null);
      test.done();
    });
  },

  testRunSuiteRetriesNoSkipTestcasesOnFail : function(test) {
    test.expect(13);
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
      suite_retries: 1
    }, function(err, results) {
      test.equals(results.errors, 0);
      test.equals(results.skipped, 0);
      test.equals(err, null);
      test.done();
    });
  },

  'test clear command queue when run with suiteRetries' : function(test) {
    var testsPath = path.join(process.cwd(), '/sampletests/suiteretries');
    test.expect(5);

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
      suite_retries: 1
    }, function(err, results) {
      test.equals(results.passed, 3);
      test.equals(err, null);
      test.done();
    });
  },

  testRunModuleSyncName : function(test) {
    test.expect(3);
    var testsPath = path.join(process.cwd(), '/sampletests/syncnames');
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      sync_test_names : true,
      globals : {
        test : test
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(err, null);
      test.ok('sampleTest' in results.modules);
      test.done();
    });
  },

  'test run multiple sources and same module name' : function(test) {
    var srcFolders = [
      path.join(process.cwd(), '/sampletests/simple'),
      path.join(process.cwd(), '/sampletests/mixed')
    ];

    this.Runner.run(srcFolders, {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false,
      start_session : true,
      src_folders : srcFolders
    }, function(err, results) {
      test.equals(err, null);

      test.ok('simple/sample' in results.modules);
      test.ok('mixed/sample' in results.modules);
      test.ok('demoTest' in results.modules['simple/sample'].completed);
      test.ok('demoTestMixed' in results.modules['mixed/sample'].completed);

      test.done();
    });
  },

  testRunMultipleSrcFolders : function(test) {
    test.expect(8);
    var testsPath = path.join(process.cwd(), '/sampletests/simple');
    var testsPath2 = path.join(process.cwd(), '/sampletests/srcfolders');
    var srcFolders = [testsPath2, testsPath];
    this.Runner.run(srcFolders, {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false,
      start_session : true,
      src_folders : srcFolders
    }, function(err, results) {
      test.equals(err, null);
      test.ok('simple/sample' in results.modules);
      test.ok('demoTest' in results.modules['simple/sample'].completed);
      test.ok('srcfolders/other_sample' in results.modules);
      test.ok('srcFoldersTest' in results.modules['srcfolders/other_sample'].completed);
      test.done();
    });
  }

};
