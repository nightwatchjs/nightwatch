const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../../lib/element/index.js');

describe('element().getAriaRole() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().getAriaRole()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/computedrole',
      method: 'GET',
      response: JSON.stringify({
        value: 'signupSection'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').getAriaRole();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, true);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'signupSection');
  });

  it('test .element().find().getAriaRole()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/1/computedrole',
      method: 'GET',
      response: JSON.stringify({
        value: 'button'
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').getAriaRole();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, true);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'button');
  });

  it('test .element.find().getAriaRole()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/computedrole',
      method: 'GET',
      response: JSON.stringify({
        value: 'signupSection'
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').getAriaRole();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, true);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 'signupSection');
  });
});