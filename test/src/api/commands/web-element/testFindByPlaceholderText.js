const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('.findByPlaceholderText() commands', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().findByPlaceholderText(exact)/getByPlaceholderText(exact)', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/elements',
      postdata: {
        using: 'css selector',
        value: '[placeholder="Email"]'
      },
      method: 'POST',
      response: JSON.stringify({
        value: [{'element-6066-11e4-a52e-4f735466cecf': '3'}]
      })
    }, true, true);

    const submitBtnElement = this.client.api.element('#signupSection').findByPlaceholderText('Email');
    assert.strictEqual(submitBtnElement instanceof Element, true);
    assert.strictEqual(await submitBtnElement.getId(), '3');
    const submitBtnWebElement = await submitBtnElement;
    assert.strictEqual(submitBtnWebElement instanceof WebElement, true);
    assert.strictEqual(await submitBtnWebElement.getId(), '3');

    const submitBtnElement2 = this.client.api.element('#signupSection').getByPlaceholderText('Email');
    assert.strictEqual(submitBtnElement2 instanceof Element, true);
    assert.strictEqual(await submitBtnElement2.getId(), '3');
    const submitBtnWebElement2 = await submitBtnElement2;
    assert.strictEqual(submitBtnWebElement2 instanceof WebElement, true);
    assert.strictEqual(await submitBtnWebElement2.getId(), '3');

    await this.client.start();
  });

  it('test .element().findByPlaceholderText()/getByPlaceholderText()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/elements',
      postdata: {
        using: 'css selector',
        value: '[placeholder*="Email"]'
      },
      method: 'POST',
      response: JSON.stringify({
        value: [{'element-6066-11e4-a52e-4f735466cecf': '4'}]
      })
    }, true, true);

    const submitBtnElement = this.client.api.element('#signupSection').findByPlaceholderText('Email', {exact: false});
    assert.strictEqual(submitBtnElement instanceof Element, true);
    assert.strictEqual(await submitBtnElement.getId(), '4');
    const submitBtnWebElement = await submitBtnElement;
    assert.strictEqual(submitBtnWebElement instanceof WebElement, true);
    assert.strictEqual(await submitBtnWebElement.getId(), '4');

    const submitBtnElement2 = this.client.api.element('#signupSection').getByPlaceholderText('Email', {exact: false});
    assert.strictEqual(submitBtnElement2 instanceof Element, true);
    assert.strictEqual(await submitBtnElement2.getId(), '4');
    const submitBtnWebElement2 = await submitBtnElement2;
    assert.strictEqual(submitBtnWebElement2 instanceof WebElement, true);
    assert.strictEqual(await submitBtnWebElement2.getId(), '4');

    await this.client.start();
  });
});
