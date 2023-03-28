const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../../lib/element/index.js');

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
});
