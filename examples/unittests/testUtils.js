const assert = require('assert');
const Utils = require('../../lib/util/utils.js');

module.exports = {
  testFormatElapsedTime : function() {
    var resultMs = Utils.formatElapsedTime(999);
    assert.equal(resultMs, '999ms');

    var resultSec = Utils.formatElapsedTime(1999);
    assert.equal(resultSec, '1.999s');

    var resultMin = Utils.formatElapsedTime(122299, true);
    assert.equal(resultMin, '2m 2s / 122299ms');
  },

  testGetTestSuiteName : function() {
    assert.equal(Utils.getTestSuiteName('test-case-one'), 'Test Case One');
    assert.equal(Utils.getTestSuiteName('test_case_two'), 'Test Case Two');
    assert.equal(Utils.getTestSuiteName('test.case.one'), 'Test Case One');
    assert.equal(Utils.getTestSuiteName('testCaseOne'), 'Test Case One');
  }
};