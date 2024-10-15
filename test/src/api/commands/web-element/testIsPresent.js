const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const path = require('path');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');
const Utils = common.require('./utils');
const NightwatchClient = common.require('index.js');
const {settings} = common;

describe('element().isPresent() command', function() {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);

  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().isPresent() present', async function() {
    const resultPromise = this.client.api.element('#signupSection').isPresent();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, true);

  });

  it('test .element().isPresent() not present', async function() {
    const resultPromise = this.client.api.element('#wrong').isPresent();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, false);

  });

  it('test .element().find().isPresent() present', async function() {
    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').isPresent();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, true);
  });

  it('test .element().find().isPresent() not present', async function() {
    const resultPromise = this.client.api.element('#signupSection').find('#wrong').isPresent();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, false);
  });

  it('test .element().isPresent() suppresses NoSuchElementError', async function() {
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
      waitForConditionTimeout: 100
    };
    const testsPath = [
      path.join(__dirname, '../../../../sampletests/isPresent/elementNotPresent.js')
    ];

    await NightwatchClient.runTests(testsPath, settings({
      globals,
      output_folder: 'output',
      selenium_host: null
    }));

    assert.strictEqual(globalReporterCalled, true);
  });
});
