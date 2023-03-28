const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const CommandGlobals = require('../../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../../lib/element/index.js');

describe('element().getId() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().getId()', async function() {
    const resultPromise = this.client.api.element('#signupSection').getId();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, '0');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, '0');
  });

  it('test .element().find().getId()', async function() {
    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').getId();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, '1');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, '1');
  });

  it('test .element.find().getId()', async function() {
    const resultPromise = this.client.api.element.find('#signupSection').getId();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, '0');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, '0');
  });
});
