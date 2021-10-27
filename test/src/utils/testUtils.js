const assert = require('assert');
const path = require('path');
const common = require('../../common.js');
const Utils = common.require('utils');

describe('test Utils', function() {

  it('testFormatElapsedTime', function() {

    let resultMs = Utils.formatElapsedTime(999);
    assert.strictEqual(resultMs, '999ms');

    let resultSec = Utils.formatElapsedTime(1999);
    assert.strictEqual(resultSec, '1.999s');

    let resultMin = Utils.formatElapsedTime(122299, true);
    assert.strictEqual(resultMin, '2m 2s / 122299ms');
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

    assert.strictEqual(Utils.makeFnAsync(1, asyncFn), asyncFn);
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

    assert.strictEqual(Utils.getTestSuiteName('test-case-one'), 'Test Case One');
    assert.strictEqual(Utils.getTestSuiteName('test_case_two'), 'Test Case Two');
    assert.strictEqual(Utils.getTestSuiteName('test.case.one'), 'Test Case One');
    assert.strictEqual(Utils.getTestSuiteName('testCaseOne'), 'Test Case One');
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
    assert.strictEqual(
      Utils.stripControlChars('\x00rendered output'),
      'rendered output'
    );
    assert.strictEqual(
      Utils.stripControlChars('rendered \x1Foutput'),
      'rendered output'
    );
    assert.strictEqual(
      Utils.stripControlChars('rendered output\x7F'),
      'rendered output'
    );
    assert.strictEqual(
      Utils.stripControlChars('\x00rendered\x1F \x1Boutput\x9F\x00'),
      'rendered output'
    );
    assert.strictEqual(
      Utils.stripControlChars(
        '\x00rendered output\nrendered \x1Foutput\nrendered output\x7F'
      ),
      'rendered output\nrendered output\nrendered output'
    );
    assert.strictEqual(
      Utils.stripControlChars(
        '\x00rendered output\rrendered \x1Foutput\rrendered output\x7F'
      ),
      'rendered output\rrendered output\rrendered output'
    );
  });

  it('testRelativeUrl', function() {
    assert.strictEqual(Utils.relativeUrl('https://nightwatchjs.org'), false);
    assert.strictEqual(Utils.relativeUrl('http://nightwatchjs.org'), false);
    assert.strictEqual(Utils.relativeUrl('chrome-extension://pkehgijcmpdhfbdbbnkijodmdjhbjlgp/skin/options.html'), false);
    assert.strictEqual(Utils.relativeUrl('nightwatchjs.org'), true);
    assert.strictEqual(Utils.relativeUrl('nightwatchjs.org/guide'), true);
    assert.strictEqual(Utils.relativeUrl('/guide'), true);
  });

  it('isTsFile', function() {
    assert.strictEqual(Utils.isTsFile('/tests/sampleTest.ts'), true);
    assert.strictEqual(Utils.isTsFile('/tests/sampleTest.js'), false);
    assert.strictEqual(Utils.isTsFile('/tests/sampleTest.json'), false);
    assert.strictEqual(Utils.isTsFile('/tests/sampleTest'), false);
  });

  it('isFileNameValid', function() {
    assert.strictEqual(Utils.isFileNameValid('/tests/sampleTest.js'), true);
    assert.strictEqual(Utils.isFileNameValid('/tests/sampleTest.ts'), true);
    assert.strictEqual(Utils.isFileNameValid('/tests/sampleTest.json'), false);
  });

  it('filterStackTrace', function() {
    let stackTrace = `Error
        at Object.this test should fail and capture screenshot (/Projects/nightwatch/examples/tests/sample.js:5:16)
        at Context.call (/node_modules/nightwatch/lib/testsuite/context.js:375:35
        at TestCase.run (/node_modules/nightwatch/lib/testsuite/testcase.js:53:31
        at Runnable.__runFn (/node_modules/nightwatch/lib/testsuite/index.js:376:80)
        at Runnable.run (/node_modules/nightwatch/lib/tes….js:123:21)
        at TestSuite.createRunnable (/node_modules/nightwatch/lib/testsuite/index.js:443:33)
        at TestSuite.handleRunnable (/node_modules/nightwatch/lib/testsuite/index.js:448:18)
        at /node_modules/nightwatch/lib/testsuite/index.js:376:21
        at processTicksAndRejections (internal/process/task_queues.js:93:5)
        at async DefaultRunner.runTestSuite (/node_modules/nightwatch/lib/runner/test-runners/default.js:68:7)`;
    let expectedStackTrace = `Error
        at Object.this test should fail and capture screenshot (/Projects/nightwatch/examples/tests/sample.js:5:16)`; 
    assert.strictEqual(Utils.filterStackTrace(stackTrace), expectedStackTrace);
  
    stackTrace = '';
    expectedStackTrace = '';
    assert.strictEqual(Utils.filterStackTrace(stackTrace), expectedStackTrace);
  });

  it('readFolderRecursively with normal folder', async function(){
    const absPath = [];
    Utils.readFolderRecursively(path.join(__dirname, '../../extra/commands/other/'), [], (sourcePath, resource) => {
      absPath.push(path.join(sourcePath, resource));
    });
    assert.deepStrictEqual(absPath, [path.join(__dirname, '../../extra/commands/other/otherCommand.js')]);
  });

  it('readFolderRecursively with glob pattern', async function(){
    const absPath = [];
    Utils.readFolderRecursively(path.join(__dirname, '../../extra/commands/typescript/*.js'), [], (sourcePath, resource) => {
      absPath.push(path.join(sourcePath, resource));
    });
    assert.deepStrictEqual(absPath, [path.join(__dirname, '../../extra/commands/typescript/tsWait.js')]);
  });
});
