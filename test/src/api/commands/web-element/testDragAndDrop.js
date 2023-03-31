const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().dragAndDrop(WebElement) command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().dragAndDrop()', async function() {
    let dragElementArgs;
    this.client.transport.Actions.session.dragElement = function(args) {
      dragElementArgs = args;

      return Promise.resolve({
        status: 0,
        value: null
      });
    };

    const webLoginWebElement = await this.client.api.element('#weblogin');
    const resultPromise = this.client.api.element('#signupSection').dragAndDrop(webLoginWebElement);
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');

    const webElementArg = await dragElementArgs.args[0];
    assert.deepStrictEqual(await webElementArg.getId(), '0');
    assert.strictEqual(dragElementArgs.args[1], webLoginWebElement);
  });

  it('test .element().dragAndDrop(elementId)', async function() {
    let dragElementArgs;
    this.client.transport.Actions.session.dragElement = function(args) {
      dragElementArgs = args;

      return Promise.resolve({
        status: 0,
        value: null
      });
    };

    const webLoginElementId = await this.client.api.element('#weblogin').getId();
    const resultPromise = this.client.api.element('#signupSection').dragAndDrop(webLoginElementId);
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');

    const webElementArg = await dragElementArgs.args[0];
    assert.deepStrictEqual(await webElementArg.getId(), '0');
    assert.strictEqual(dragElementArgs.args[1], webLoginElementId);
  });

  it('test .element().dragAndDrop({x, y})', async function() {
    let dragElementArgs;
    this.client.transport.Actions.session.dragElement = function(args) {
      dragElementArgs = args;

      return Promise.resolve({
        status: 0,
        value: null
      });
    };

    const resultPromise = this.client.api.element('#signupSection').dragAndDrop({x: 100, y: 200});
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');

    const webElementArg = await dragElementArgs.args[0];
    assert.deepStrictEqual(await webElementArg.getId(), '0');
    assert.deepStrictEqual(dragElementArgs.args[1], {x: 100, y: 200});
  });

  it('test .element().find().dragAndDrop(WebElement)', async function() {
    let dragElementArgs;
    this.client.transport.Actions.session.dragElement = function(args) {
      dragElementArgs = args;

      return Promise.resolve({
        status: 0,
        value: null
      });
    };

    const webLoginWebElement = await this.client.api.element('#weblogin');
    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').dragAndDrop(webLoginWebElement);
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '1');

    const webElementArg = await dragElementArgs.args[0];
    assert.deepStrictEqual(await webElementArg.getId(), '1');
    assert.strictEqual(dragElementArgs.args[1], webLoginWebElement);
  });

  it('test .element.find().dragAndDrop()', async function() {
    let dragElementArgs;
    this.client.transport.Actions.session.dragElement = function(args) {
      dragElementArgs = args;

      return Promise.resolve({
        status: 0,
        value: null
      });
    };

    const webLoginWebElement = await this.client.api.element('#weblogin');
    const resultPromise = this.client.api.element.find('#signupSection').dragAndDrop(webLoginWebElement);
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');

    const webElementArg = await dragElementArgs.args[0];
    assert.deepStrictEqual(await webElementArg.getId(), '0');
    assert.strictEqual(dragElementArgs.args[1], webLoginWebElement);
  });
});
