const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().getProperty() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().getProperty()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/property/classList',
      method: 'GET',
      response: JSON.stringify({
        value: ['.signup']
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getProperty('classList');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.deepStrictEqual(result, ['.signup']);

    const resultValue = await resultPromise.value;
    assert.deepStrictEqual(resultValue, ['.signup']);
  });

  it('test .element().property()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/property/classList',
      method: 'GET',
      response: JSON.stringify({
        value: ['.signup']
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').property('classList');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.deepStrictEqual(result, ['.signup']);

    const resultValue = await resultPromise.value;
    assert.deepStrictEqual(resultValue, ['.signup']);
  });

  it('test .element().find().getProperty()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/1/property/classList',
      method: 'GET',
      response: JSON.stringify({
        value: ['.btn']
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').getProperty('classList');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.deepStrictEqual(result, ['.btn']);

    const resultValue = await resultPromise.value;
    assert.deepStrictEqual(resultValue, ['.btn']);
  });

  it('test .element.find().getProperty()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/property/classList',
      method: 'GET',
      response: JSON.stringify({
        value: ['.signup']
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').getProperty('classList');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.deepStrictEqual(result, ['.signup']);

    const resultValue = await resultPromise.value;
    assert.deepStrictEqual(resultValue, ['.signup']);
  });
});
