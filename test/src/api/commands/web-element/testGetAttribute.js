const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().getAttribute() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().getAttribute()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: 'text'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getAttribute('type');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'text');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'text');
  });

  it('test .element().find().getAttribute()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: 'text'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').getAttribute('type');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'text');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'text');
  });

  it('test .element.find().getAttribute()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: 'text'
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').getAttribute('type');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'text');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'text');
  });

  it('test .element().getAttribute() assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: 'text'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getAttribute('type');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    assert.strictEqual(await resultPromise.assert.equals('text'), 'text');
    assert.strictEqual(await resultPromise.assert.contains('tex'), 'text');
    assert.strictEqual(await resultPromise.assert.matches(/te[a-z]{2}/), 'text');

    assert.strictEqual(await resultPromise.assert.not.equals('texxt'), 'text');
    assert.strictEqual(await resultPromise.assert.not.contains('texx'), 'text');
    assert.strictEqual(await resultPromise.assert.not.matches(/te[a-z]{2}x/), 'text');
  });
});
