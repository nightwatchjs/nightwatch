const assert = require('assert');
const path = require('path');
const MockServer  = require('../../../../lib/mockserver.js');
const Mocks = require('../../../../lib/command-mocks.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const NightwatchClient = common.require('index.js');
const {settings} = common;

describe('element().isPresent() command', function() {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);

  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element.find(suppressNotFoundErrors: true) suppresses NoSuchElementError', async function() {
    Mocks.createNewW3CSession();
    MockServer.addMock({
      url: '/session/13521-10219-202/elements',
      method: 'POST',
      postdata: JSON.stringify({using: 'css selector', value: '#wrong'}),
      response: JSON.stringify({
        value: []
      })
    });

    let globalReporterCalled = false;

    const globals = {
      reporter(results) {
        globalReporterCalled = true;
        if (Object.prototype.hasOwnProperty.call(results, 'lastError')) {
          assert.notStrictEqual(results.lastError.name, 'NoSuchElementError');
        }
      },
      waitForConditionTimeout: 100,
      selector: '#wrong',
      suppressNotFoundErrors: true
    };
    const testsPath = [
      path.join(__dirname, '../../../../sampletests/webelement/findWithSuppressNotFoundErrors.js')
    ];

    await NightwatchClient.runTests(testsPath, settings({
      globals,
      output_folder: 'output',
      selenium_host: null
    }));

    assert.strictEqual(globalReporterCalled, true);
  });

  it('test .element.find(suppressNotFoundErrors: false) does not suppress NoSuchElementError', async function() {
    Mocks.createNewW3CSession();
    MockServer.addMock({
      url: '/session/13521-10219-202/elements',
      method: 'POST',
      postdata: JSON.stringify({using: 'css selector', value: '#wrong'}),
      response: JSON.stringify({
        value: []
      })
    });

    let globalReporterCalled = false;

    const globals = {
      reporter(results) {
        globalReporterCalled = true;
        assert.strictEqual(results.lastError.name, 'NoSuchElementError');
      },
      waitForConditionTimeout: 100,
      selector: '#wrong',
      suppressNotFoundErrors: false
    };
    const testsPath = [
      path.join(__dirname, '../../../../sampletests/webelement/findWithSuppressNotFoundErrors.js')
    ];

    await NightwatchClient.runTests(testsPath, settings({
      globals,
      output_folder: 'output',
      selenium_host: null
    }));

    assert.strictEqual(globalReporterCalled, true);
  });

  it('test .element.find(suppressNotFoundErrors: true) does not suppress other errors', async function() {
    Mocks.createNewW3CSession();
    MockServer.addMock({
      url: '/session/13521-10219-202/elements',
      method: 'POST',
      postdata: JSON.stringify({using: 'css selector', value: '@wrong'}),
      response: {
        value: {
          error: 'invalid selector',
          message: 'invalid selector',
          stacktrace: ''
        }
      },
      statusCode: 400
    });

    let globalReporterCalled = false;

    const globals = {
      reporter(results) {
        globalReporterCalled = true;
        assert.strictEqual(results.lastError.name, 'InvalidSelectorError');
      },
      waitForConditionTimeout: 100,
      selector: '@wrong',
      suppressNotFoundErrors: true
    };
    const testsPath = [
      path.join(__dirname, '../../../../sampletests/webelement/findWithSuppressNotFoundErrors.js')
    ];

    await NightwatchClient.runTests(testsPath, settings({
      globals,
      output_folder: 'output',
      selenium_host: null
    }));

    assert.strictEqual(globalReporterCalled, true);
  });

  it('test .element.find(suppressNotFoundErrors: false) does not suppress other errors', async function() {
    Mocks.createNewW3CSession();
    MockServer.addMock({
      url: '/session/13521-10219-202/elements',
      method: 'POST',
      postdata: JSON.stringify({using: 'css selector', value: '@wrong'}),
      response: {
        value: {
          error: 'invalid selector',
          message: 'invalid selector',
          stacktrace: ''
        }
      },
      statusCode: 400
    });

    let globalReporterCalled = false;

    const globals = {
      reporter(results) {
        globalReporterCalled = true;
        assert.strictEqual(results.lastError.name, 'InvalidSelectorError');
      },
      waitForConditionTimeout: 100,
      selector: '@wrong',
      suppressNotFoundErrors: false
    };
    const testsPath = [
      path.join(__dirname, '../../../../sampletests/webelement/findWithSuppressNotFoundErrors.js')
    ];

    await NightwatchClient.runTests(testsPath, settings({
      globals,
      output_folder: 'output',
      selenium_host: null
    }));

    assert.strictEqual(globalReporterCalled, true);
  });
});
