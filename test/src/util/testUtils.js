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

  it('testFlattenArrayDeep', function() {

    assert.throws(() => {
      Utils.flattenArrayDeep(null);
    }, Error);
    assert.throws(() => {
      Utils.flattenArrayDeep({name: 'test'});
    }, Error);
    assert.throws(() => {
      Utils.flattenArrayDeep('test');
    }, Error);
  });

  it('testStripControlChars', function() {

    assert.doesNotThrow(() => Utils.stripControlChars(null));
    assert.equal(
      Utils.stripControlChars('\x00rendered output'),
      'rendered output'
    );
    assert.equal(
      Utils.stripControlChars('rendered \x1Foutput'),
      'rendered output'
    );
    assert.equal(
      Utils.stripControlChars('rendered output\x7F'),
      'rendered output'
    );
    assert.equal(
      Utils.stripControlChars('\x00rendered\x1F \x1Boutput\x9F\x00'),
      'rendered output'
    );
    assert.equal(
      Utils.stripControlChars(
        '\x00rendered output\nrendered \x1Foutput\nrendered output\x7F'
      ),
      'rendered output\nrendered output\nrendered output'
    );
    assert.equal(
      Utils.stripControlChars(
        '\x00rendered output\rrendered \x1Foutput\rrendered output\x7F'
      ),
      'rendered output\rrendered output\rrendered output'
    );
  });

  it('testRelativeUrl', function() {
    assert.equal(Utils.relativeUrl('https://nightwatchjs.org'), false);
    assert.equal(Utils.relativeUrl('http://nightwatchjs.org'), false);
    assert.equal(Utils.relativeUrl('chrome-extension://pkehgijcmpdhfbdbbnkijodmdjhbjlgp/skin/options.html'), false);
    assert.equal(Utils.relativeUrl('nightwatchjs.org'), true);
    assert.equal(Utils.relativeUrl('nightwatchjs.org/guide'), true);
    assert.equal(Utils.relativeUrl('/guide'), true);
  });
});
