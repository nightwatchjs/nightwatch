const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().getAriaRole() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().getAriaRole()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/computedrole',
      method: 'GET',
      response: JSON.stringify({
        value: 'signupSection'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getAriaRole();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'signupSection');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'signupSection');
  });

  it('test .element().find().getAriaRole()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/1/computedrole',
      method: 'GET',
      response: JSON.stringify({
        value: 'button'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').getAriaRole();
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

  it('test .element.find().getAriaRole()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/computedrole',
      method: 'GET',
      response: JSON.stringify({
        value: 'signupSection'
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').getAriaRole();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'signupSection');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'signupSection');
  });

  it('test .element().getAriaRole() assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/computedrole',
      method: 'GET',
      response: JSON.stringify({
        value: 'signupSection'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getAriaRole();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    assert.strictEqual(await resultPromise.assert.equals('signupSection'), 'signupSection');
    assert.strictEqual(await resultPromise.assert.contains('signup'), 'signupSection');
    assert.strictEqual(await resultPromise.assert.matches(/si[a-z]{2}upS[a-z]{6}/), 'signupSection');

    assert.strictEqual(await resultPromise.assert.not.equals('Signupx'), 'signupSection');
    assert.strictEqual(await resultPromise.assert.not.contains('Signupx'), 'signupSection');
    assert.strictEqual(await resultPromise.assert.not.matches(/Si[a-z]{2}upx/), 'signupSection');
  });
});
