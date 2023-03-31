const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().takeScreenshot() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().takeScreenshot()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/screenshot',
      method: 'GET',
      response: JSON.stringify({
        value: 'iVBORw0KGgoAAAANSUhEUgAAAbsAAAAiCAYAAADGd3chAAABK',
        suppressBase64Data: true
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').takeScreenshot();
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');
  });

  it('test .element().find().takeScreenshot()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/1/screenshot',
      method: 'GET',
      response: JSON.stringify({
        value: 'iVBORw0KGgoAAAANSUhEUgAAAbsAAAAiCAYAAADGd3chAAABK',
        suppressBase64Data: true
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').takeScreenshot();
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '1');
  });

  it('test .element.find().takeScreenshot()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/screenshot',
      method: 'GET',
      response: JSON.stringify({
        value: 'iVBORw0KGgoAAAANSUhEUgAAAbsAAAAiCAYAAADGd3chAAABK',
        suppressBase64Data: true
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').takeScreenshot();
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');
  });
});
