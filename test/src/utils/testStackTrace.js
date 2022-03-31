const assert = require('assert');
const path = require('path');
const AssertionError = require('assertion-error');
const common = require('../../common.js');
const Utils = common.require('utils');
const beautifyStackTrace = common.require('utils/beautifyStackTrace.js');
const colors = common.require('utils/colors.js');

describe('test stackTrace parse', function() {
  before(() => colors.disable());
  after(() => colors.enable());

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

  it('beautifyStackTrace -  read file lines (AssertionError)', async function() {

    const errorFilePath = path.join(__dirname, '../../sampletests/withfailures/sample.js');
    const lineNumber = 15;

    const error = new AssertionError('Assertion Error');
    error.stack = `Error
      at DescribeInstance.<anonymous> (${errorFilePath}:${lineNumber}:23)
      at Context.call (/Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/testsuite/context.js:430:35)
      at TestCase.run (/Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/testsuite/testcase.js:58:31)
      at Runnable.__runFn (/Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/testsuite/index.js:659:80)
      at Runnable.run (/Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/testsuite/runnable.js:126:21)
      at TestSuite.createRunnable (/Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/testsuite/index.js:766:33)
      at TestSuite.handleRunnable (/Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/testsuite/index.js:771:33)
      at /Users/BarnOwl/Documents/Projects/Nightwatch/node_modules/nightwatch/lib/testsuite/index.js:659:21
      at processTicksAndRejections (node:internal/process/task_queues:96:5)`;

    const expected = ` ${errorFilePath}:
 ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  13 |     client.url('http://localhost')
  14 |       .assert.elementPresent('#weblogin')
  15 |       .assert.elementPresent('#badElement') 
  16 |       .assert.elementPresent('#webLogin')
  17 |       .end();
 ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
`;

    const result = beautifyStackTrace(error);
    assert.strictEqual(result, expected);
  });

  it('beautifyStackTrace - Unknown API method', function() {
    const errorFilePath = path.join(__dirname, '../../sampletests/unknown-method/UnknownMethod.js');
    const lineNumber  = 4;

    const error = new TypeError('Unknown method');
    error.stack = `Error: Unknown api method "elementPresen".
      at DescribeInstance.<anonymous> (${errorFilePath}:${lineNumber}:21)
      at Context.call (/Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/testsuite/context.js:430:35)
      at TestCase.run (/Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/testsuite/testcase.js:58:31)
      at Runnable.__runFn (/Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/testsuite/index.js:669:80)
      at Runnable.run (/Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/testsuite/runnable.js:126:21)
      at TestSuite.createRunnable (/Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/testsuite/index.js:776:33)
      at TestSuite.handleRunnable (/Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/testsuite/index.js:781:33)
      at /Users/BarnOwl/Documents/Projects/Nightwatch-tests/node_modules/nightwatch/lib/testsuite/index.js:669:21
      at processTicksAndRejections (node:internal/process/task_queues:96:5)`;

    const expected = ` ${errorFilePath}:
 –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  2 |   it('failure stack trace', function() {
  3 |    
  4 |     browser.url('http://localhost') 
  5 |       .assert.elementPresen('#badElement'); // mispelled API method
  6 |   });
 –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
`;

    const result = Utils.beautifyStackTrace(error);
    assert.strictEqual(result, expected);
  });

});
