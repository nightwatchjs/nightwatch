const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().getCssProperty() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().getCssProperty()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/css/height',
      method: 'GET',
      response: JSON.stringify({
        value: '150px'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getCssProperty('height');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    
    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');


    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, '150px');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, '150px');
  });

  it('test .element().css()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/css/height',
      method: 'GET',
      response: JSON.stringify({
        value: '150px'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').css('height');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    
    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, '150px');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, '150px');
  });

  it('test .element().find().getCssProperty()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/1/css/height',
      method: 'GET',
      response: JSON.stringify({
        value: '34px'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').getCssProperty('height');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, '34px');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, '34px');
  });

  it('test .element.find().getCssProperty()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/css/height',
      method: 'GET',
      response: JSON.stringify({
        value: '150px'
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').getCssProperty('height');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, '150px');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, '150px');
  });

  it('test .element().getCssProperty() assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/css/height',
      method: 'GET',
      response: JSON.stringify({
        value: '150px'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getCssProperty('height');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    
    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    assert.strictEqual(await resultPromise.assert.equals('150px'), '150px');
    assert.strictEqual(await resultPromise.assert.contains('150'), '150px');
    assert.strictEqual(await resultPromise.assert.matches(/150[a-z]{2}/), '150px');

    assert.strictEqual(await resultPromise.assert.not.equals('150x'), '150px');
    assert.strictEqual(await resultPromise.assert.not.contains('150x'), '150px');
    assert.strictEqual(await resultPromise.assert.not.matches(/150[a-z]{2}x/), '150px');
  });
});
