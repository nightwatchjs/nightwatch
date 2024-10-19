const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');

describe('element().getComputedLabel() command', function() {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);

  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().getComputedLabel() success', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/computedlabel',
      method: 'GET',
      response: JSON.stringify({
        value: 'signup'
      })
    });

    const resultPromise = this.client.api.element('#signupSection').getComputedLabel();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'signup');

  });

  it('test .element().getComputedLabel() via find', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/1/computedlabel',
      method: 'GET',
      response: JSON.stringify({
        value: 'help'
      })
    });

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').getComputedLabel();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'help');

  });
});