const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().clickAndHold() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().clickAndHold()', async function() {
    let pressAndHoldArgs;
    this.client.transport.Actions.session.pressAndHold = function(args) {
      pressAndHoldArgs = args;

      return Promise.resolve({
        status: 0,
        value: null
      });
    };

    const resultPromise = this.client.api.element('#signupSection').clickAndHold();
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');

    const webElementArg = await pressAndHoldArgs.args[0];
    assert.deepStrictEqual(await webElementArg.getId(), '0');
  });

  it('test .element().find().clickAndHold()', async function() {
    let pressAndHoldArgs;
    this.client.transport.Actions.session.pressAndHold = function(args) {
      pressAndHoldArgs = args;

      return Promise.resolve({
        status: 0,
        value: null
      });
    };

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').clickAndHold();
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '1');

    const webElementArg = await pressAndHoldArgs.args[0];
    assert.deepStrictEqual(await webElementArg.getId(), '1');
  });

  it('test .element.find().clickAndHold()', async function() {
    let pressAndHoldArgs;
    this.client.transport.Actions.session.pressAndHold = function(args) {
      pressAndHoldArgs = args;

      return Promise.resolve({
        status: 0,
        value: null
      });
    };

    const resultPromise = this.client.api.element.find('#signupSection').clickAndHold();
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');

    const webElementArg = await pressAndHoldArgs.args[0];
    assert.deepStrictEqual(await webElementArg.getId(), '0');
  });
});
