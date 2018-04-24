const assert = require('assert');
const common = require('../../common.js');
const Utils = common.require('util/utils.js');

describe('test Utils', function() {

  it('testFormatElapsedTime', function() {

    let resultMs = Utils.formatElapsedTime(999);
    assert.equal(resultMs, '999ms');

    let resultSec = Utils.formatElapsedTime(1999);
    assert.equal(resultSec, '1.999s');

    let resultMin = Utils.formatElapsedTime(122299, true);
    assert.equal(resultMin, '2m 2s / 122299ms');
  });

  it('testMakeFnAsync', function() {
    function asyncFn(cb) {
      cb();
    }

    function syncFn() {
    }

    let convertedFn = Utils.makeFnAsync(1, syncFn);
    let called = false;
    convertedFn(function() {
      called = true;
    });

    assert.equal(Utils.makeFnAsync(1, asyncFn), asyncFn);
    assert.ok(called);
  });

  it('testCheckFunction', function() {
    let g = {
      fn: function() {
      }
    };

    let o = {
      fn: false
    };

    let x = {
      y: {
        testFn: function() {
        }
      }
    };

    assert.ok(Utils.checkFunction('fn', g));
    assert.ok(!Utils.checkFunction('fn', o));
    assert.ok(Utils.checkFunction('testFn', x.y));
  });

  it('testGetTestSuiteName', function() {

    assert.equal(Utils.getTestSuiteName('test-case-one'), 'Test Case One');
    assert.equal(Utils.getTestSuiteName('test_case_two'), 'Test Case Two');
    assert.equal(Utils.getTestSuiteName('test.case.one'), 'Test Case One');
    assert.equal(Utils.getTestSuiteName('testCaseOne'), 'Test Case One');
  });
});
