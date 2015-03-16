var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Utils = require('../../' + BASE_PATH +'/util/utils.js');

module.exports = {
  testFormatElapsedTime : function(test) {

    var resultMs = Utils.formatElapsedTime(999);
    test.equals(resultMs, '999ms');

    var resultSec = Utils.formatElapsedTime(1999);
    test.equals(resultSec, '1.999s');

    var resultMin = Utils.formatElapsedTime(122299, true);
    test.equals(resultMin, '2m 2s / 122299ms');

    test.done();

  },

  testMakeFnAsync : function(test) {
    function asynFn(done) {
      done();
    }

    function syncFn() {}

    test.expect(2);
    test.equals(Utils.makeFnAsync(1, asynFn), asynFn);

    var convertedFn = Utils.makeFnAsync(1, syncFn);
    convertedFn(function() {
      test.ok('converted fn called');
    });

    test.done();
  },

  testCheckFunction : function(test) {
    var g = {
      fn : function() {}
    };

    var o = {
      fn : false
    };

    var x = {
      y : {
        testFn : function() {}
      }
    };

    test.ok(Utils.checkFunction('fn', g));
    test.ok(!Utils.checkFunction('fn', o));
    test.ok(Utils.checkFunction('testFn', x.y));
    test.done();
  },

  testGetTestSuiteName : function(test) {

    test.equals(Utils.getTestSuiteName('test-case-one'), 'Test Case One');
    test.equals(Utils.getTestSuiteName('test_case_two'), 'Test Case Two');
    test.equals(Utils.getTestSuiteName('test.case.one'), 'Test Case One');
    test.equals(Utils.getTestSuiteName('testCaseOne'), 'Test Case One');

    test.done();
  }
};

