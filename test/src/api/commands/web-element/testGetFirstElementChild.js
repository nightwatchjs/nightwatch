const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().getFirstElementChild() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().getFirstElementChild()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: {
          'element-6066-11e4-a52e-4f735466cecf': '9'
        }
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getFirstElementChild();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(resultPromise instanceof Promise, true);
    assert.strictEqual(typeof resultPromise.find, 'function');
    assert.strictEqual(typeof resultPromise.getValue, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '9');
  });

  it('test .element().find().getFirstElementChild()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: {
          'element-6066-11e4-a52e-4f735466cecf': '10'
        }
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').getFirstElementChild('type');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(resultPromise instanceof Promise, true);
    assert.strictEqual(typeof resultPromise.find, 'function');
    assert.strictEqual(typeof resultPromise.getValue, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '10');
  });

  it('test .element.find().getFirstElementChild()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: {
          'element-6066-11e4-a52e-4f735466cecf': '9'
        }
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').getFirstElementChild('type');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(resultPromise instanceof Promise, true);
    assert.strictEqual(typeof resultPromise.find, 'function');
    assert.strictEqual(typeof resultPromise.getValue, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '9');
  });
});
