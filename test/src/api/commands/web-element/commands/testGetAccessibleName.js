const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../../lib/element/index.js');

describe('element().getAccessibleName() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().getAccessibleName()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/computedlabel',
      method: 'GET',
      response: JSON.stringify({
        value: 'Signup'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getAccessibleName();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'Signup');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'Signup');
  });

  it('test .element().find().getAccessibleName()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/1/computedlabel',
      method: 'GET',
      response: JSON.stringify({
        value: 'Help'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').getAccessibleName();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'Help');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'Help');
  });

  it('test .element.find().getAccessibleName()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/computedlabel',
      method: 'GET',
      response: JSON.stringify({
        value: 'Signup'
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').getAccessibleName();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'Signup');

    const resultValue = await resultPromise.value;
    assert.strictEqual(resultValue, 'Signup');
  });
});
