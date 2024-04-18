const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');

describe('element().isEnabled() command', function() {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().isEnabled() enabled', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/enabled',
      method: 'GET',
      response: JSON.stringify({
        value: true
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').isEnabled();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, true);

  });

  it('test .element().isEnabled() not enabled', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/enabled',
      method: 'GET',
      response: JSON.stringify({
        value: false
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').isEnabled();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, false);
  });

  it('test .element().find().isEnabled()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/1/enabled',
      method: 'GET',
      response: JSON.stringify({
        value: true
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').isEnabled();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, true);
  });

  it('test .element.find().isEnabled() not enabled', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/enabled',
      method: 'GET',
      response: JSON.stringify({
        value: false
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').isEnabled();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, false);
  });

  it('test .element().isEnabled() assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/enabled',
      method: 'GET',
      response: JSON.stringify({
        value: true
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').isEnabled();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    assert.strictEqual(await resultPromise.assert.equals(true), true);
    assert.strictEqual(await resultPromise.assert.not.equals(false), true);
  });

});
