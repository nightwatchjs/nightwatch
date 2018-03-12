const assert = require('assert');
const Utils = require('../../lib/util/utils.js');

module.exports = {
  testFormatElapsedTime : function(client, done) {
    var resultMs = Utils.formatElapsedTime(999);
    client.assert.equal(resultMs, '999ms');

    var resultSec = Utils.formatElapsedTime(1999);
    client.assert.equal(resultSec, '1.999s');

    var resultMin = Utils.formatElapsedTime(122299, true);
    client.assert.equal(resultMin, '2m 2s / 122299ms');

    done();
  },

  // testMakeFnAsync : function(client) {
  //   function asynFn(done) {
  //     done();
  //   }
  //
  //   function syncFn() {}
  //
  //   var test = client.assert;
  //
  //   test.equal(Utils.makeFnAsync(1, asynFn), asynFn);
  //
  //   var convertedFn = Utils.makeFnAsync(1, syncFn);
  //   convertedFn(function() {
  //     test.ok('converted fn called');
  //   });
  // },

  testGetTestSuiteName : function() {
    assert.equal(Utils.getTestSuiteName('test-case-one'), 'Test Case One');
    assert.equal(Utils.getTestSuiteName('test_case_two'), 'Test Case Two');
    assert.equal(Utils.getTestSuiteName('test.case.one'), 'Test Case One');
    assert.equal(Utils.getTestSuiteName('testCaseOne'), 'Test Case One');
  }
};