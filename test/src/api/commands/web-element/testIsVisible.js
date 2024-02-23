const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');

describe('element().isVisible() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().isVisible()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/text',
      method: 'GET',
      response: JSON.stringify({
        value: 'Signup'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').isVisible();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'Signup');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'Signup');
  });

  it('test .element().find().isVisible()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/1/text',
      method: 'GET',
      response: JSON.stringify({
        value: 'Help'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').isVisible();
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

  it('test .element.find().isVisible()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/text',
      method: 'GET',
      response: JSON.stringify({
        value: 'Signup'
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').isVisible();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'Signup');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'Signup');
  });

  it('test .element().isVisible() assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/text',
      method: 'GET',
      response: JSON.stringify({
        value: 'Signup'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').isVisible();
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
