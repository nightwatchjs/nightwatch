const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().upload() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().upload()', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/elements',
        postdata: {
          using: 'css selector',
          value: '#choosefile'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '9'}]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/9/value',
        method: 'POST',
        postdata: {
          text: '/file.js',
          value: [
            '/', 'f', 'i', 'l', 'e', '.', 'j', 's'
          ]
        },
        response: JSON.stringify({
          value: null
        })
      }, true);

    const resultPromise = this.client.api.element('#choosefile').upload('/file.js');
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '9');
  });

  it('test .element().find().upload()', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'css selector',
          value: '#choosefile'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '9'}]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/9/value',
        method: 'POST',
        postdata: {
          text: '/file.js',
          value: [
            '/', 'f', 'i', 'l', 'e', '.', 'j', 's'
          ]
        },
        response: JSON.stringify({
          value: null
        })
      }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#choosefile').upload('/file.js');
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '9');
  });

  it('test .element.find().upload()', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'css selector',
          value: '#choosefile'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '9'}]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/9/value',
        method: 'POST',
        postdata: {
          text: '/file.js',
          value: [
            '/', 'f', 'i', 'l', 'e', '.', 'j', 's'
          ]
        },
        response: JSON.stringify({
          value: null
        })
      }, true);

    const resultPromise = this.client.api.element.find('#signupSection').find('#choosefile').upload('/file.js');
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '9');
  });
});
