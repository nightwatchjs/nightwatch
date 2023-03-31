const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('.findByAltText() commands', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().findByAltText(exact)/getByAltText(exact)', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/elements',
      postdata: {
        using: 'css selector',
        value: '[alt="Email"]'
      },
      method: 'POST',
      response: JSON.stringify({
        value: [{'element-6066-11e4-a52e-4f735466cecf': '7'}]
      })
    }, true, true);

    const submitBtnElement = this.client.api.element('#signupSection').findByAltText('Email');
    assert.strictEqual(submitBtnElement instanceof Element, true);
    assert.strictEqual(await submitBtnElement.getId(), '7');
    const submitBtnWebElement = await submitBtnElement;
    assert.strictEqual(submitBtnWebElement instanceof WebElement, true);
    assert.strictEqual(await submitBtnWebElement.getId(), '7');

    const submitBtnElement2 = this.client.api.element('#signupSection').getByAltText('Email');
    assert.strictEqual(submitBtnElement2 instanceof Element, true);
    assert.strictEqual(await submitBtnElement2.getId(), '7');
    const submitBtnWebElement2 = await submitBtnElement2;
    assert.strictEqual(submitBtnWebElement2 instanceof WebElement, true);
    assert.strictEqual(await submitBtnWebElement2.getId(), '7');

    await this.client.start();
  });

  it('test .element().findByAltText()/getByAltText()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/elements',
      postdata: {
        using: 'css selector',
        value: '[alt*="Email"]'
      },
      method: 'POST',
      response: JSON.stringify({
        value: [{'element-6066-11e4-a52e-4f735466cecf': '8'}]
      })
    }, true, true);

    const submitBtnElement = this.client.api.element('#signupSection').findByAltText('Email', {exact: false});
    assert.strictEqual(submitBtnElement instanceof Element, true);
    assert.strictEqual(await submitBtnElement.getId(), '8');
    const submitBtnWebElement = await submitBtnElement;
    assert.strictEqual(submitBtnWebElement instanceof WebElement, true);
    assert.strictEqual(await submitBtnWebElement.getId(), '8');

    const submitBtnElement2 = this.client.api.element('#signupSection').getByAltText('Email', {exact: false});
    assert.strictEqual(submitBtnElement2 instanceof Element, true);
    assert.strictEqual(await submitBtnElement2.getId(), '8');
    const submitBtnWebElement2 = await submitBtnElement2;
    assert.strictEqual(submitBtnWebElement2 instanceof WebElement, true);
    assert.strictEqual(await submitBtnWebElement2.getId(), '8');

    await this.client.start();
  });
});
