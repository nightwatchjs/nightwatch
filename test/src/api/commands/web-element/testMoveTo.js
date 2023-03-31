const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().moveTo() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().moveTo()', async function() {
    let moveToArgs;
    this.client.transport.Actions.session.moveTo = function(args) {
      moveToArgs = args;

      return Promise.resolve({
        status: 0,
        value: null
      });
    };

    const resultPromise = this.client.api.element('#signupSection').moveTo();
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');

    const webElementArg = await moveToArgs.args[0];
    assert.deepStrictEqual(await webElementArg.getId(), '0');
    assert.strictEqual(moveToArgs.args[1], 0);
    assert.strictEqual(moveToArgs.args[2], 0);
  });

  it('test .element().moveTo(x, y)', async function() {
    let moveToArgs;
    this.client.transport.Actions.session.moveTo = function(args) {
      moveToArgs = args;

      return Promise.resolve({
        status: 0,
        value: null
      });
    };

    const resultPromise = this.client.api.element('#signupSection').moveTo(50, 100);
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');

    const webElementArg = await moveToArgs.args[0];
    assert.deepStrictEqual(await webElementArg.getId(), '0');
    assert.strictEqual(moveToArgs.args[1], 50);
    assert.strictEqual(moveToArgs.args[2], 100);
  });

  it('test .element().find().moveTo()', async function() {
    let moveToArgs;
    this.client.transport.Actions.session.moveTo = function(args) {
      moveToArgs = args;

      return Promise.resolve({
        status: 0,
        value: null
      });
    };

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').moveTo();
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '1');

    const webElementArg = await moveToArgs.args[0];
    assert.deepStrictEqual(await webElementArg.getId(), '1');
    assert.strictEqual(moveToArgs.args[1], 0);
    assert.strictEqual(moveToArgs.args[2], 0);
  });

  it('test .element.find().moveTo()', async function() {
    let moveToArgs;
    this.client.transport.Actions.session.moveTo = function(args) {
      moveToArgs = args;

      return Promise.resolve({
        status: 0,
        value: null
      });
    };

    const resultPromise = this.client.api.element.find('#signupSection').moveTo();
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');

    const webElementArg = await moveToArgs.args[0];
    assert.deepStrictEqual(await webElementArg.getId(), '0');
    assert.strictEqual(moveToArgs.args[1], 0);
    assert.strictEqual(moveToArgs.args[2], 0);
  });
});
