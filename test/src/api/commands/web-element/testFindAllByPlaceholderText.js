const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().findAllByPlaceholderText() commands', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().findAllByPlaceholderText()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/elements',
      postdata: {
        using: 'css selector',
        value: '[placeholder="Email"]'
      },
      method: 'POST',
      response: JSON.stringify({
        value: [
          {'element-6066-11e4-a52e-4f735466cecf': '8'},
          {'element-6066-11e4-a52e-4f735466cecf': '2'},
          {'element-6066-11e4-a52e-4f735466cecf': '3'}
        ]
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').findAllByPlaceholderText('Email');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(typeof resultPromise.click, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');
    assert.strictEqual(typeof resultPromise.nth, 'function');
    assert.strictEqual(typeof resultPromise.count, 'function');

    const result = await resultPromise;
    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0] instanceof WebElement, true);
    assert.strictEqual(await result[0].getId(), '8');

    const resultCount = await resultPromise.count();
    assert.strictEqual(resultCount, 3);

    const secondResultPromise = resultPromise.nth(1);
    assert.strictEqual(secondResultPromise instanceof Element, false);
    assert.strictEqual(secondResultPromise instanceof Promise, true);
    assert.strictEqual(typeof secondResultPromise.find, 'function');
    assert.strictEqual(typeof secondResultPromise.getValue, 'function');

    const secondResult = await secondResultPromise;
    assert.strictEqual(secondResult instanceof WebElement, true);
    assert.strictEqual(await secondResult.getId(), '2');
  });

  it('test .element().getAllByPlaceholderText()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/elements',
      postdata: {
        using: 'css selector',
        value: '[placeholder*="Email"]'
      },
      method: 'POST',
      response: JSON.stringify({
        value: [
          {'element-6066-11e4-a52e-4f735466cecf': '8'},
          {'element-6066-11e4-a52e-4f735466cecf': '2'},
          {'element-6066-11e4-a52e-4f735466cecf': '3'}
        ]
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getAllByPlaceholderText('Email', {exact: false});
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(typeof resultPromise.click, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');
    assert.strictEqual(typeof resultPromise.nth, 'function');
    assert.strictEqual(typeof resultPromise.count, 'function');

    const result = await resultPromise;
    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0] instanceof WebElement, true);
    assert.strictEqual(await result[0].getId(), '8');
  });

  it('test .element.findAllByPlaceholderText()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/elements',
      postdata: {
        using: 'css selector',
        value: '[placeholder="Email"]'
      },
      method: 'POST',
      response: JSON.stringify({
        value: [
          {'element-6066-11e4-a52e-4f735466cecf': '8'},
          {'element-6066-11e4-a52e-4f735466cecf': '2'},
          {'element-6066-11e4-a52e-4f735466cecf': '3'}
        ]
      })
    }, true);

    const resultPromise = this.client.api.element.findAllByPlaceholderText('Email');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(typeof resultPromise.click, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');
    assert.strictEqual(typeof resultPromise.nth, 'function');
    assert.strictEqual(typeof resultPromise.count, 'function');

    const result = await resultPromise;
    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0] instanceof WebElement, true);
    assert.strictEqual(await result[0].getId(), '8');
  });
});
