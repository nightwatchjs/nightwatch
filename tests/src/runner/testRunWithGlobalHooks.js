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

  testRunWithGlobalBeforeAndAfter : function(test) {
    test.expect(22);
    var testsPath = path.join(process.cwd(), '/sampletests/before-after');
    var beforeEachCount = 0;
    var afterEachCount = 0;
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test,
        beforeEach: function() { beforeEachCount++; },
        afterEach: function() { afterEachCount++; }
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(err, null);
      test.equals(beforeEachCount, 3);
      test.equals(afterEachCount, 3);
      test.done();
    });
  },

  testRunWithGlobalAsyncBeforeEachAndAfterEach : function(test) {
    test.expect(22);
    var testsPath = path.join(process.cwd(), '/sampletests/before-after');
    var beforeEachCount = 0;
    var afterEachCount = 0;
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test,
        beforeEach: function(done) {
          setTimeout(function() { beforeEachCount++; done(); }, 100);
        },
        afterEach: function(done) {
          setTimeout(function() { afterEachCount++; done(); }, 100);
        }
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(err, null);
      test.equals(beforeEachCount, 3);
      test.equals(afterEachCount, 3);
      test.done();
    });
  },

  testRunWithGlobalAsyncBeforeEachAndAfterEachWithBrowser : function(test) {
    test.expect(25);
    var testsPath = path.join(process.cwd(), '/sampletests/before-after');
    var beforeEachCount = 0;
    var afterEachCount = 0;
    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test,
        beforeEach: function(client, done) {
          test.deepEqual(client.globals, this);
          setTimeout(function() {
            beforeEachCount++;
            done();
          }, 100);
        },
        afterEach: function(client, done) {
          setTimeout(function() {
            afterEachCount++;
            done();
          }, 100);
        }
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(err, null);
      test.equals(beforeEachCount, 3);
      test.equals(afterEachCount, 3);
      test.done();
    });
  },

  'test run with global async beforeEach and assert failure' : function(test) {
    test.expect(3);
    var beforeEachCount = 0;
    var testsPath = path.join(process.cwd(), '/sampletests/before-after');

    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test,
        beforeEach: function(client, done) {
          client.perform(function() {
            beforeEachCount++;
            client.assert.equal(0, 1);
            done();
          });
        }
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(err, null);
      test.equals(results.modules.sampleSingleTest.errmessages.length, 0);
      test.equals(beforeEachCount, 3);
      test.done();
    });
  },

  'test run with global async beforeEach and exception' : function(test) {
    var testsPath = path.join(process.cwd(), '/sampletests/before-after');

    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test,
        beforeEach: function(client, done) {
          client.perform(function() {
            throw new Error('x');
          });
        }
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.equals(results.modules.sampleSingleTest.errmessages.length, 1);
      test.equals(results.modules.sampleWithBeforeAndAfter.errmessages.length, 1);
      test.equals(results.modules.syncBeforeAndAfter.errmessages.length, 1);
      test.equals(results.modules.sampleSingleTest.errmessages[0].indexOf('Error while running perform command:'), 0);
      test.done();
    });
  },

  'test run with global async beforeEach and done(err);' : function(test) {
    var testsPath = path.join(process.cwd(), '/sampletests/before-after');

    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test,
        beforeEach: function(client, done) {
          setTimeout(function() {
            done(new Error('global beforeEach error'));
          }, 10);
        }
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.ok(err instanceof Error);
      test.equals(err.message, 'global beforeEach error');

      test.done();
    });
  },

  'test currentTest in global beforeEach/afterEach' : function(test) {
    test.expect(18);
    var testsPath = path.join(process.cwd(), '/sampletests/withfailures');

    this.Runner.run([testsPath], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test,
        beforeEach: function(client, done) {
          test.deepEqual(client.currentTest.results.steps, [ 'demoTest', 'demoTest2' ]);
          test.equals(client.currentTest.results.passed, 0);
          test.equals(client.currentTest.results.failed, 0);
          test.equals(client.currentTest.results.tests, 0);
          test.deepEqual(client.currentTest.module, 'sample');
          test.deepEqual(client.currentTest.name, '');
          done();
        },
        afterEach: function(client, done) {
          test.deepEqual(client.currentTest.results.steps, ['demoTest2' ]);
          test.equals(client.currentTest.results.passed, 1);
          test.equals(client.currentTest.results.failed, 1);
          test.equals(client.currentTest.results.tests, 2);
          test.ok('demoTest' in client.currentTest.results.testcases);

          test.deepEqual(client.currentTest.name, 'demoTest');
          test.deepEqual(client.currentTest.module, 'sample');
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
  }

};
