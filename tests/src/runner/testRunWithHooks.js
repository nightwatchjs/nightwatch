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

  'test run with async setUp and tearDown' : function(test) {
    test.expect(5);
    var testsPath = path.join(process.cwd(), '/sampletests/async');
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
      test.ok('sample' in results.modules);
      test.ok('demoTestAsync' in results.modules.sample.completed);
      test.done();
    });
  },

  'test run with async tearDown' : function(test) {
    test.expect(6);
    var testsPath = path.join(process.cwd(), '/sampletests/mixed');
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
      test.ok('sample' in results.modules);
      test.ok('demoTestMixed' in results.modules.sample.completed);
      test.done();
    });
  },

  testRunAsyncWithBeforeAndAfter : function(test) {
    test.expect(34);
    var testsPath = path.join(process.cwd(), '/sampletests/before-after');
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
      test.ok('sampleWithBeforeAndAfter' in results.modules);

      var result = results.modules.sampleWithBeforeAndAfter.completed;
      test.ok('demoTestAsyncOne' in result);
      test.ok('demoTestAsyncTwo' in result);
      test.ok(!('beforeEach' in result));
      test.ok(!('before' in result));
      test.ok(!('afterEach' in result));
      test.ok(!('after' in result));
      test.ok('syncBeforeAndAfter' in results.modules);
      test.ok('demoTestAsyncOne' in result);
      test.ok('demoTestAsyncTwo' in result);
      test.ok(!('beforeEach' in result));
      test.ok(!('before' in result));
      test.ok(!('afterEach' in result));
      test.ok(!('after' in result));
      test.done();
    });
  },

  testRunTestCaseWithBeforeAndAfter : function(test) {
    var testsPath = path.join(process.cwd(), '/sampletests/before-after/syncBeforeAndAfter.js');
    test.expect(11);
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
      testcase : 'demoTestSyncOne'
    }, function(err, results) {
      test.equals(err, null);
      var result = results.modules.syncBeforeAndAfter.completed;
      test.ok('demoTestSyncOne' in result);
      test.ok(!('beforeEach' in result));
      test.ok(!('before' in result));
      test.ok(!('afterEach' in result));
      test.ok(!('after' in result));
      test.done();
    });
  },

  testRunWithAsyncHooks : function(test) {
    var testsPath = path.join(process.cwd(), '/sampletests/withasynchooks');
    test.expect(8);

    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      custom_commands_path : path.join(process.cwd(), '/extra/commands'),
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

  'test async afterEach hook timeout error' : function(test) {
    var testsPath = path.join(process.cwd(), '/asynchookstests/afterEach-timeout');

    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test,
        asyncHookTimeout : 10
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.ok(err instanceof Error);

      test.done();
    });
  }
};
