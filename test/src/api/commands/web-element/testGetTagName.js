const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().getTagName() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().getTagName()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/name',
      method: 'GET',
      response: JSON.stringify({
        value: 'div'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getTagName();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'div');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'div');
  });

  it('test .element().find().getTagName()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/1/name',
      method: 'GET',
      response: JSON.stringify({
        value: 'button'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').getTagName();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'button');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'button');
  });

  it('test .element.find().getTagName()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/name',
      method: 'GET',
      response: JSON.stringify({
        value: 'div'
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').getTagName();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'div');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'div');
  });

  it('test .element().getTagName() assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/name',
      method: 'GET',
      response: JSON.stringify({
        value: 'div'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getTagName();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    assert.strictEqual(await resultPromise.assert.equals('div'), 'div');
    assert.strictEqual(await resultPromise.assert.contains('di'), 'div');
    assert.strictEqual(await resultPromise.assert.matches(/di[a-z]{1}/), 'div');

    assert.strictEqual(await resultPromise.assert.not.equals('divx'), 'div');
    assert.strictEqual(await resultPromise.assert.not.contains('dx'), 'div');
    assert.strictEqual(await resultPromise.assert.not.matches(/di[a-z]{2}x/), 'div');
  });
});
