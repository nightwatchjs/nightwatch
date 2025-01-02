const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');

describe('element().isActive() command', function() {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().isActive() active', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/active',
      method: 'GET',
      response: JSON.stringify({
        value: {
          'element-6066-11e4-a52e-4f735466cecf': '0'
        }
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').isActive();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, true);
  });

  it('test .element().isActive() not active', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/active',
      method: 'GET',
      response: JSON.stringify({
        value: {
          'element-6066-11e4-a52e-4f735466cecf': 'random-elem'
        }
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').isActive();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, false);
  });

  it('test .element().find().isActive()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/active',
      method: 'GET',
      response: JSON.stringify({
        value: {
          'element-6066-11e4-a52e-4f735466cecf': '1'
        }
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').isActive();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, true);
  });

  it('test .element.find().isActive() not active', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/active',
      method: 'GET',
      response: JSON.stringify({
        value: {
          'element-6066-11e4-a52e-4f735466cecf': 'random-elem'
        }
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').isActive();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, false);
  });

  it('test .element().isActive() assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/active',
      method: 'GET',
      response: JSON.stringify({
        value: {
          'element-6066-11e4-a52e-4f735466cecf': '0'
        }
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').isActive();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    assert.strictEqual(await resultPromise.assert.equals(true), true);
    assert.strictEqual(await resultPromise.assert.not.equals(false), true);
  });
});
