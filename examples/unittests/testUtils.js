var Utils = require('../../lib/util/utils.js');

module.exports = {
  testFormatElapsedTime : function(client) {
    var test = client.assert;

    var resultMs = Utils.formatElapsedTime(999);
    test.equal(resultMs, '999ms');

    var resultSec = Utils.formatElapsedTime(1999);
    test.equal(resultSec, '1.999s');

    var resultMin = Utils.formatElapsedTime(122299, true);
    test.equal(resultMin, '2m 2s / 122299ms');
  },

  testMakeFnAsync : function(client) {
    function asynFn(done) {
      done();
    }

    function syncFn() {}

    var test = client.assert;

    test.equal(Utils.makeFnAsync(1, asynFn), asynFn);

    var convertedFn = Utils.makeFnAsync(1, syncFn);
    convertedFn(function() {
      test.ok('converted fn called');
    });
  },

  testGetTestSuiteName : function(client) {
    var test = client.assert;
    test.equal(Utils.getTestSuiteName('test-case-one'), 'Test Case One');
    test.equal(Utils.getTestSuiteName('test_case_two'), 'Test Case Two');
    test.equal(Utils.getTestSuiteName('test.case.one'), 'Test Case One');
    test.equal(Utils.getTestSuiteName('testCaseOne'), 'Test Case One');
  }
};