var assert = require('assert');
var common = require('../../common.js');
var Utils = common.require('util/utils.js');

module.exports = {
  'test Utils' : {
    testFormatElapsedTime : function() {
      
      var resultMs = Utils.formatElapsedTime(999);
      assert.equal(resultMs, '999ms');

      var resultSec = Utils.formatElapsedTime(1999);
      assert.equal(resultSec, '1.999s');

      var resultMin = Utils.formatElapsedTime(122299, true);
      assert.equal(resultMin, '2m 2s / 122299ms');
    },

    testMakeFnAsync : function() {
      function asyncFn(cb) {
        cb();
      }

      function syncFn() {}

      var convertedFn = Utils.makeFnAsync(1, syncFn);
      var called = false;
      convertedFn(function() {
        called = true;
      });

      assert.equal(Utils.makeFnAsync(1, asyncFn), asyncFn);
      assert.ok(called);
    },

    testCheckFunction : function() {
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

      assert.ok(Utils.checkFunction('fn', g));
      assert.ok(!Utils.checkFunction('fn', o));
      assert.ok(Utils.checkFunction('testFn', x.y));
    },

    testGetTestSuiteName : function() {

      assert.equal(Utils.getTestSuiteName('test-case-one'), 'Test Case One');
      assert.equal(Utils.getTestSuiteName('test_case_two'), 'Test Case Two');
      assert.equal(Utils.getTestSuiteName('test.case.one'), 'Test Case One');
      assert.equal(Utils.getTestSuiteName('testCaseOne'), 'Test Case One');
    }
  }
};
