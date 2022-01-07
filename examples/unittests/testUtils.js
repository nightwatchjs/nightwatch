const assert = require('assert');
const Utils = require('../../lib/utils/');

module.exports = {
  testFormatElapsedTime: function() {
    var resultMs = Utils.formatElapsedTime(999);
    assert.strictEqual(resultMs, '999ms');

    var resultSec = Utils.formatElapsedTime(1999);
    assert.strictEqual(resultSec, '1.999s');

    var resultMin = Utils.formatElapsedTime(122299, true);
    assert.strictEqual(resultMin, '2m 2s / 122299ms');
  },

  testGetTestSuiteName: function() {
    assert.strictEqual(Utils.getTestSuiteName('test-case-one'), 'Test Case One');
    assert.strictEqual(Utils.getTestSuiteName('test_case_two'), 'Test Case Two');
    assert.strictEqual(Utils.getTestSuiteName('test.case.one'), 'Test Case One');
    assert.strictEqual(Utils.getTestSuiteName('testCaseOne'), 'Test Case One');
  }
};