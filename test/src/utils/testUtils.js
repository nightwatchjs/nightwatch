const assert = require('assert');
const path = require('path');
const fs = require('fs');
const common = require('../../common.js');
const Utils = common.require('utils');

const buildStackTrace = function(errorFilePath, lineNumber) {
  let expectedLines = fs.readFileSync(errorFilePath, 'utf-8').split(/\r?\n/).reduce(function(lines, line, index) {
    const pos = index + 1;
    if (pos === lineNumber) {
      lines += Utils.Logger.colors.cyan(`\t${pos} ${line}\n`);
    } else if ((pos <= lineNumber + 2) && (pos >= lineNumber - 2)) {
      lines += `\t${pos} ${line}\n`;
    }

    return lines;
  }, '');
  expectedLines += '\n';

  return expectedLines;
};



describe('test Utils', function() {

  it('testFormatElapsedTime', function() {

    const resultMs = Utils.formatElapsedTime(999);
    assert.strictEqual(resultMs, '999ms');

    const resultSec = Utils.formatElapsedTime(1999);
    assert.strictEqual(resultSec, '1.999s');

    const resultMin = Utils.formatElapsedTime(122299, true);
    assert.strictEqual(resultMin, '2m 2s / 122299ms');
  });

  it('testMakeFnAsync', function() {
    function asyncFn(cb) {
      cb();
    }

    function syncFn() {
    }

    const convertedFn = Utils.makeFnAsync(1, syncFn);
    let called = false;
    convertedFn(function() {
      called = true;
    });

    assert.strictEqual(Utils.makeFnAsync(1, asyncFn), asyncFn);
    assert.ok(called);
  });

  it('testCheckFunction', function() {
    const g = {
      fn: function() {
      }
    };

    const o = {
      fn: false
    };

    const x = {
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

  it('beautifyStackTrace -  read file lines (NightwatchAssertError)', async function() {

    const errorFilePath = path.join(__dirname, '../../sampletests/withfailures/sample.js');
    const lineNumber = 15;
    const expectedLines = buildStackTrace(errorFilePath, lineNumber);

    const error = {
      name: 'NightwatchAssertError',
      message: '\'Timed out while waiting for element <input[name=a]> to be present for 5000 milliseconds. - expected [0;32m"found"[0m but got: [0;31m"not found"[0m [0;90m(5123ms)[0m\'',
      stack: `Error
      at Proxy.<anonymous> (/Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/api/index.js:145:30)
      at DescribeInstance.<anonymous> (${errorFilePath}:${lineNumber}:23)
      at Context.call (/Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/testsuite/context.js:430:35)
      at TestCase.run (/Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/testsuite/testcase.js:58:31)
      at Runnable.__runFn (/Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/testsuite/index.js:659:80)
      at Runnable.run (/Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/testsuite/runnable.js:126:21)
      at TestSuite.createRunnable (/Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/testsuite/index.js:766:33)
      at TestSuite.handleRunnable (/Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/testsuite/index.js:771:33)
      at /Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/testsuite/index.js:659:21
      at processTicksAndRejections (node:internal/process/task_queues:96:5)`
    };
    const errorLines = Utils.beautifyStackTrace(error);
    assert.strictEqual(errorLines, expectedLines);
  });

  it('beautifyStackTrace - Unknown API method', function() {
    const errorFilePath = path.join(__dirname, '../../sampletests/unknown-method/UnknownMethod.js');
    const lineNumber  = 4;

    const expectedLines = buildStackTrace(errorFilePath, lineNumber);

    const error = {
      name: 'Error',
      message: 'Unknown api method "elmentPresen".',
      stack: `Error: Unknown api method "elementPresen".
      at Proxy.<anonymous> (/Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/api/index.js:142:19)
      at DescribeInstance.<anonymous> (${errorFilePath}:${lineNumber}:21)
      at Context.call (/Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/testsuite/context.js:430:35)
      at TestCase.run (/Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/testsuite/testcase.js:58:31)
      at Runnable.__runFn (/Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/testsuite/index.js:669:80)
      at Runnable.run (/Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/testsuite/runnable.js:126:21)
      at TestSuite.createRunnable (/Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/testsuite/index.js:776:33)
      at TestSuite.handleRunnable (/Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/testsuite/index.js:781:33)
      at /Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/testsuite/index.js:669:21
      at processTicksAndRejections (node:internal/process/task_queues:96:5)`
    };

    const errorLines = Utils.beautifyStackTrace(error);
    assert.strictEqual(errorLines, expectedLines);
  });

});
