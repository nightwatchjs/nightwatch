const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().getRect() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().getRect()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/rect',
      method: 'GET',
      response: JSON.stringify({
        value: {height: 34, width: 443, x: 356, y: 381.5}
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getRect();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.deepStrictEqual(result, {height: 34, width: 443, x: 356, y: 381.5});

    const resultValue = await resultPromise.value;
    assert.deepStrictEqual(resultValue, {height: 34, width: 443, x: 356, y: 381.5});
  });

  it('test .element().getSize()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/rect',
      method: 'GET',
      response: JSON.stringify({
        value: {height: 34, width: 443, x: 356, y: 381.5}
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getSize();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.deepStrictEqual(result, {height: 34, width: 443, x: 356, y: 381.5});

    const resultValue = await resultPromise.value;
    assert.deepStrictEqual(resultValue, {height: 34, width: 443, x: 356, y: 381.5});
  });

  it('test .element().getLocation()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/rect',
      method: 'GET',
      response: JSON.stringify({
        value: {height: 34, width: 443, x: 356, y: 381.5}
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getLocation();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.deepStrictEqual(result, {height: 34, width: 443, x: 356, y: 381.5});

    const resultValue = await resultPromise.value;
    assert.deepStrictEqual(resultValue, {height: 34, width: 443, x: 356, y: 381.5});
  });

  it('test .element().find().getRect()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/1/rect',
      method: 'GET',
      response: JSON.stringify({
        value: {height: 34, width: 443, x: 356, y: 381.5}
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').getRect();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.deepStrictEqual(result, {height: 34, width: 443, x: 356, y: 381.5});

    const resultValue = await resultPromise.value;
    assert.deepStrictEqual(resultValue, {height: 34, width: 443, x: 356, y: 381.5});
  });

  it('test .element.find().getRect()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/rect',
      method: 'GET',
      response: JSON.stringify({
        value: {height: 34, width: 443, x: 356, y: 381.5}
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').getRect();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.deepStrictEqual(result, {height: 34, width: 443, x: 356, y: 381.5});

    const resultValue = await resultPromise.value;
    assert.deepStrictEqual(resultValue, {height: 34, width: 443, x: 356, y: 381.5});
  });
});
