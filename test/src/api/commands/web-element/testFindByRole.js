const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().findByRole() commands', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().findByRole()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/elements',
      postdata: {
        using: 'css selector',
        value: '*[role~="button"],input,summary,button'
      },
      method: 'POST',
      response: JSON.stringify({
        value: [
          {'element-6066-11e4-a52e-4f735466cecf': '9'},
          {'element-6066-11e4-a52e-4f735466cecf': '2'}
        ]
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').findByRole('button');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(resultPromise instanceof Promise, true);
    assert.strictEqual(typeof resultPromise.find, 'function');
    assert.strictEqual(typeof resultPromise.getValue, 'function');
    assert.strictEqual(typeof resultPromise.assert, 'object');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '9');
  });
  
  it('test .element().getByRole()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/elements',
      postdata: {
        using: 'css selector',
        value: '*[role~="button"],input,summary,button'
      },
      method: 'POST',
      response: JSON.stringify({
        value: [
          {'element-6066-11e4-a52e-4f735466cecf': '9'},
          {'element-6066-11e4-a52e-4f735466cecf': '2'}
        ]
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getByRole('button');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(resultPromise instanceof Promise, true);
    assert.strictEqual(typeof resultPromise.find, 'function');
    assert.strictEqual(typeof resultPromise.getValue, 'function');
    assert.strictEqual(typeof resultPromise.assert, 'object');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '9');
  });

  it('test .element.findByRole()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/elements',
      postdata: {
        using: 'css selector',
        value: '*[role~="button"],input,summary,button'
      },
      method: 'POST',
      response: JSON.stringify({
        value: [
          {'element-6066-11e4-a52e-4f735466cecf': '9'},
          {'element-6066-11e4-a52e-4f735466cecf': '2'}
        ]
      })
    }, true);

    const resultPromise = this.client.api.element.findByRole('button');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(resultPromise instanceof Promise, true);
    assert.strictEqual(typeof resultPromise.find, 'function');
    assert.strictEqual(typeof resultPromise.getValue, 'function');
    assert.strictEqual(typeof resultPromise.assert, 'object');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '9');
  });
});
