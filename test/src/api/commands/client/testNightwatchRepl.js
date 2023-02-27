const assert = require('assert');
const mockery = require('mockery');
const nodeRepl = require('repl');

describe('startServer', function() {
  beforeEach(function() {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('with default config', function() {
    let configUsed;
    mockery.registerMock('repl', {
      start(config) {
        configUsed = config;

        return 'repl';
      }
    });

    let contextPassed;
    mockery.registerMock('vm', {
      createContext(context) {
        contextPassed = context;
      }
    });

    const NightwatchRepl = require('../../../../../lib/testsuite/repl.js');
    const repl = new NightwatchRepl();

    const context = {browser: 'something', app: 'other'};
    repl.startServer(context);

    assert.strictEqual(contextPassed, context);
    assert.strictEqual(configUsed.preview, true);
    assert.strictEqual(configUsed.timeout, 5500);

    assert.strictEqual(repl._context, context);
    assert.strictEqual(repl._replServer, 'repl');
  });

  it('with custom config', function() {
    let configUsed;
    mockery.registerMock('repl', {
      start(config) {
        configUsed = config;

        return 'repl';
      }
    });

    let contextPassed;
    mockery.registerMock('vm', {
      createContext(context) {
        contextPassed = context;
      }
    });

    const NightwatchRepl = require('../../../../../lib/testsuite/repl.js');

    const config = {preview: false, timeout: 6000};
    const repl = new NightwatchRepl(config);

    const context = {browser: 'something'};
    repl.startServer(context);

    assert.strictEqual(contextPassed, context);
    assert.strictEqual(configUsed.preview, false);
    assert.strictEqual(configUsed.timeout, 6000);

    assert.strictEqual(repl._context, context);
    assert.strictEqual(repl._replServer, 'repl');
  });
});

describe('_eval', function() {
  beforeEach(function() {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('calls _outputPreview if cmd represents auto-complete request', () => {
    const NightwatchRepl = require('../../../../../lib/testsuite/repl.js');
    const repl = new NightwatchRepl();

    let outputPreviewCalled = false;
    repl._outputPreview = () => {
      outputPreviewCalled = true;
    };
    repl._eval('try { nightwatch } catch {}');

    assert.strictEqual(outputPreviewCalled, true);
  });

  it('cmd not evaluated if result is awaited', function() {
    let commandEvaluated = false;
    mockery.registerMock('vm', {
      runInContext() {
        commandEvaluated = true;
      }
    });

    const NightwatchRepl = require('../../../../../lib/testsuite/repl.js');
    const repl = new NightwatchRepl();

    repl._resultAwaited = true;
    repl._eval('1+1');

    assert.strictEqual(commandEvaluated, false);
  });

  it('cmd is evaluated correctly', function() {
    mockery.registerMock('repl', {
      start() {}
    });

    let handleResultCalled = false;
    let resultObtained;

    const NightwatchRepl = require('../../../../../lib/testsuite/repl.js');
    const repl = new NightwatchRepl();

    repl.startServer({});
    repl._handleResult = (result) => {
      handleResultCalled = true;
      resultObtained = result;
    };

    repl._eval('1+1');

    assert.strictEqual(handleResultCalled, true);
    assert.strictEqual(resultObtained, 2);
  });

  it('logs error and calls callback for wrong cmd', function() {
    mockery.registerMock('repl', {
      start() {}
    });

    let errorLogged;
    mockery.registerMock('../utils', {
      Logger: class {
        static error(err) {
          errorLogged = err;
        }
      }
    });

    let callbackCalled = false;
    let callbackErrorPassed;
    let callbackResultPassed;
    const callback = (error, result) => {
      callbackCalled = true;
      callbackErrorPassed = error;
      callbackResultPassed = result;
    };

    let handleResultCalled = false;

    const NightwatchRepl = require('../../../../../lib/testsuite/repl.js');
    const repl = new NightwatchRepl();

    repl.startServer({});
    repl._handleResult = () => {
      handleResultCalled = true;
    };

    repl._eval('random', undefined, undefined, callback);

    assert.strictEqual(handleResultCalled, false);
    assert.strictEqual(errorLogged.name, 'ReferenceError');
    assert.strictEqual(callbackCalled, true);
    assert.strictEqual(callbackErrorPassed, undefined);
    assert.strictEqual(callbackResultPassed, undefined);
  });

  it('asks for more input if cmd is incomplete', function() {
    mockery.registerMock('repl', {
      start() {},
      Recoverable: nodeRepl.Recoverable
    });

    let callbackCalled = false;
    let callbackErrorPassed;
    let callbackResultPassed;
    const callback = (error, result) => {
      callbackCalled = true;
      callbackErrorPassed = error;
      callbackResultPassed = result;
    };

    let handleResultCalled = false;

    const NightwatchRepl = require('../../../../../lib/testsuite/repl.js');
    const repl = new NightwatchRepl();

    repl.startServer({});
    repl._handleResult = () => {
      handleResultCalled = true;
    };

    repl._eval('console.log(', undefined, undefined, callback);

    assert.strictEqual(handleResultCalled, false);
    assert.strictEqual(callbackCalled, true);
    assert.strictEqual(callbackErrorPassed instanceof nodeRepl.Recoverable, true);
    assert.strictEqual(callbackResultPassed, undefined);
  });
});

describe('_handleResult', function() {
  it('result is undefined', function() {
    let errorReturned;
    let resultReturned;
    const callback = (error, result) => {
      errorReturned = error;
      resultReturned = result;
    };

    const NightwatchRepl = require('../../../../../lib/testsuite/repl.js');
    const repl = new NightwatchRepl();
    repl._handleResult(undefined, callback);

    // Assertions are written in this fashion to make sure that the
    // execution is synchronous (values are assigned to variables here).
    assert.strictEqual(errorReturned, null);
    assert.strictEqual(resultReturned, undefined);
    assert.strictEqual(repl._resultAwaited, undefined);
  });

  it('result is non-promise', function() {
    let errorReturned;
    let resultReturned;
    const callback = (error, result) => {
      errorReturned = error;
      resultReturned = result;
    };

    const NightwatchRepl = require('../../../../../lib/testsuite/repl.js');
    const repl = new NightwatchRepl();
    repl._handleResult('Google', callback);

    assert.strictEqual(errorReturned, null);
    assert.strictEqual(resultReturned, 'Google');
    assert.strictEqual(repl._resultAwaited, undefined);
  });

  it('result is a promise resolved before timeout', function(done) {
    const startTime = new Date();
    let callbackCalledCount = 0;

    const NightwatchRepl = require('../../../../../lib/testsuite/repl.js');

    const config = {timeout: 1000};
    const repl = new NightwatchRepl(config);

    const result = new Promise((resolve) => {
      setTimeout(() => {
        resolve('something');
      }, 500);
    });
    repl._handleResult(result, (error, result) => {
      const timeElapsed = new Date() - startTime;
      assert.ok(timeElapsed >= 500);
      assert.ok(timeElapsed <= 600);

      assert.strictEqual(error, null);
      assert.strictEqual(result, 'something');
      assert.strictEqual(repl._resultAwaited, false);

      // This callback is only called once
      callbackCalledCount++;
      assert.strictEqual(callbackCalledCount, 1);
    });

    assert.strictEqual(repl._resultAwaited, true);

    // Call done after the last possible call that can be
    // made to callback passed into _handleResult.
    setTimeout(() => {
      done();
    }, 1100);
  });

  it('result is a promise resolved after timeout', function(done) {
    const startTime = new Date();
    let callbackCalledCount = 0;

    const NightwatchRepl = require('../../../../../lib/testsuite/repl.js');

    const config = {timeout: 1000};
    const repl = new NightwatchRepl(config);

    const result = new Promise((resolve) => {
      setTimeout(() => {
        resolve('something');
      }, 1500);
    });
    repl._handleResult(result, (error, result) => {
      const timeElapsed = new Date() - startTime;
      assert.ok(timeElapsed >= 1000);
      assert.ok(timeElapsed <= 1100);

      assert.strictEqual(error, undefined);
      assert.strictEqual(result, undefined);
      assert.strictEqual(repl._resultAwaited, false);

      // This callback is only called once
      callbackCalledCount++;
      assert.strictEqual(callbackCalledCount, 1);
    });

    assert.strictEqual(repl._resultAwaited, true);

    // Call done after the last possible call that can be
    // made to callback passed into _handleResult.
    setTimeout(() => {
      done();
    }, 1600);
  });
});

describe('_outputPreview', () => {
  it('calls callback with correct result if found', () => {
    let callbackCalled = false;
    let callbackErrorPassed;
    let callbackResultPassed;
    const callback = (error, result) => {
      callbackCalled = true;
      callbackErrorPassed = error;
      callbackResultPassed = result;
    };

    const NightwatchRepl = require('../../../../../lib/testsuite/repl.js');
    const repl = new NightwatchRepl();
    repl._context = {
      nightwatch: {
        is: {
          the: 'best'
        }
      }
    };
    repl._outputPreview('try { nightwatch.is.the } catch {}', callback);

    assert.strictEqual(callbackCalled, true);
    assert.strictEqual(callbackErrorPassed, null);
    assert.strictEqual(callbackResultPassed, 'best');
  });

  it('does not call callback if command not resolvable', () => {
    let callbackCalled = false;
    let callbackErrorPassed;
    let callbackResultPassed;
    const callback = (error, result) => {
      callbackCalled = true;
      callbackErrorPassed = error;
      callbackResultPassed = result;
    };

    const NightwatchRepl = require('../../../../../lib/testsuite/repl.js');
    const repl = new NightwatchRepl();
    repl._context = {
      nightwatch: {
        is: {
          the: 'best'
        }
      }
    };
    repl._outputPreview('try { nightwatch.iss.the } catch {}', callback);

    assert.strictEqual(callbackCalled, false);
    assert.strictEqual(callbackErrorPassed, undefined);
    assert.strictEqual(callbackResultPassed, undefined);
  });
});