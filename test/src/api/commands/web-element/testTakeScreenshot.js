const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');

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
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'iVBORw0KGgoAAAANSUhEUgAAAbsAAAAiCAYAAADGd3chAAABK');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'iVBORw0KGgoAAAANSUhEUgAAAbsAAAAiCAYAAADGd3chAAABK');
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
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'iVBORw0KGgoAAAANSUhEUgAAAbsAAAAiCAYAAADGd3chAAABK');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'iVBORw0KGgoAAAANSUhEUgAAAbsAAAAiCAYAAADGd3chAAABK');
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
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'iVBORw0KGgoAAAANSUhEUgAAAbsAAAAiCAYAAADGd3chAAABK');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'iVBORw0KGgoAAAANSUhEUgAAAbsAAAAiCAYAAADGd3chAAABK');
  });
});
