const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('.findByText() commands', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().findByText(exact)/getByText(exact)', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/elements',
      postdata: {
        using: 'xpath',
        value: './/*[text()="Submit"]'
      },
      method: 'POST',
      response: JSON.stringify({
        value: [{'element-6066-11e4-a52e-4f735466cecf': '5'}]
      })
    }, true, true);

    const submitBtnElement = this.client.api.element('#signupSection').findByText('Submit');
    assert.strictEqual(submitBtnElement instanceof Element, true);
    assert.strictEqual(await submitBtnElement.getId(), '5');
    const submitBtnWebElement = await submitBtnElement;
    assert.strictEqual(submitBtnWebElement instanceof WebElement, true);
    assert.strictEqual(await submitBtnWebElement.getId(), '5');

    const submitBtnElement2 = this.client.api.element('#signupSection').getByText('Submit');
    assert.strictEqual(submitBtnElement2 instanceof Element, true);
    assert.strictEqual(await submitBtnElement2.getId(), '5');
    const submitBtnWebElement2 = await submitBtnElement2;
    assert.strictEqual(submitBtnWebElement2 instanceof WebElement, true);
    assert.strictEqual(await submitBtnWebElement2.getId(), '5');

    await this.client.start();
  });

  it('test .element().findByText()/getByText()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/elements',
      postdata: {
        using: 'xpath',
        value: './/*[contains(text(),"Submit")]'
      },
      method: 'POST',
      response: JSON.stringify({
        value: [{'element-6066-11e4-a52e-4f735466cecf': '6'}]
      })
    }, true, true);

    const submitBtnElement = this.client.api.element('#signupSection').findByText('Submit', {exact: false});
    assert.strictEqual(submitBtnElement instanceof Element, true);
    assert.strictEqual(await submitBtnElement.getId(), '6');
    const submitBtnWebElement = await submitBtnElement;
    assert.strictEqual(submitBtnWebElement instanceof WebElement, true);
    assert.strictEqual(await submitBtnWebElement.getId(), '6');

    const submitBtnElement2 = this.client.api.element('#signupSection').getByText('Submit', {exact: false});
    assert.strictEqual(submitBtnElement2 instanceof Element, true);
    assert.strictEqual(await submitBtnElement2.getId(), '6');
    const submitBtnWebElement2 = await submitBtnElement2;
    assert.strictEqual(submitBtnWebElement2 instanceof WebElement, true);
    assert.strictEqual(await submitBtnWebElement2.getId(), '6');

    await this.client.start();
  });
});
