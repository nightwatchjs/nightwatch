const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().getValue() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().getValue()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/property/value',
      method: 'GET',
      response: JSON.stringify({
        value: ''
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getValue();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, '');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, '');
  });

  it('test .element().find().getValue()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/1/property/value',
      method: 'GET',
      response: JSON.stringify({
        value: 'Help'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').getValue();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'Help');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'Help');
  });

  it('test .element.find().getValue()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/property/value',
      method: 'GET',
      response: JSON.stringify({
        value: ''
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').getValue();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, '');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, '');
  });

  it('test .element().getValue() assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/property/value',
      method: 'GET',
      response: JSON.stringify({
        value: 'Signup'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getValue();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    assert.strictEqual(await resultPromise.assert.equals('Signup'), 'Signup');
    assert.strictEqual(await resultPromise.assert.contains('Sign'), 'Signup');
    assert.strictEqual(await resultPromise.assert.matches(/Si[a-z]{2}up/), 'Signup');

    assert.strictEqual(await resultPromise.assert.not.equals('Signupx'), 'Signup');
    assert.strictEqual(await resultPromise.assert.not.contains('Signupx'), 'Signup');
    assert.strictEqual(await resultPromise.assert.not.matches(/Si[a-z]{2}upx/), 'Signup');
  });
});
