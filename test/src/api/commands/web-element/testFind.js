const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().find() commands', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().find()', async function() {
    const helpBtnElement = this.client.api.element('#signupSection').find('#helpBtn');
    assert.strictEqual(helpBtnElement instanceof Element, true);
    assert.strictEqual(await helpBtnElement.getId(), '1');

    const helpBtnWebElement = await helpBtnElement;
    assert.strictEqual(helpBtnWebElement instanceof WebElement, true);
    assert.strictEqual(await helpBtnWebElement.getId(), '1');
  });

  it('test .element().get()', async function() {
    const helpBtnElement = this.client.api.element('#signupSection').get('#helpBtn');
    assert.strictEqual(helpBtnElement instanceof Element, true);
    assert.strictEqual(await helpBtnElement.getId(), '1');

    const helpBtnWebElement = await helpBtnElement;
    assert.strictEqual(helpBtnWebElement instanceof WebElement, true);
    assert.strictEqual(await helpBtnWebElement.getId(), '1');
  });

  it('test .element().findElement()', async function() {
    const helpBtnElement = this.client.api.element('#signupSection').findElement('#helpBtn');
    assert.strictEqual(helpBtnElement instanceof Element, true);
    assert.strictEqual(await helpBtnElement.getId(), '1');

    const helpBtnWebElement = await helpBtnElement;
    assert.strictEqual(helpBtnWebElement instanceof WebElement, true);
    assert.strictEqual(await helpBtnWebElement.getId(), '1');
  });

  it('test .element().find(selectorObject)', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/elements',
      postdata: {
        using: 'xpath',
        value: '//*[id="helpBtn"]'
      },
      method: 'POST',
      response: JSON.stringify({
        value: [{'element-6066-11e4-a52e-4f735466cecf': '2'}]
      })
    }, true);

    const helpBtnElement = this.client.api.element('#signupSection').find({
      locateStrategy: 'xpath', selector: '//*[id="helpBtn"]'});
    assert.strictEqual(helpBtnElement instanceof Element, true);
    assert.strictEqual(await helpBtnElement.getId(), '2');

    const helpBtnWebElement = await helpBtnElement;
    assert.strictEqual(helpBtnWebElement instanceof WebElement, true);
    assert.strictEqual(await helpBtnWebElement.getId(), '2');
  });

  it('test .element.find()', async function() {
    const signupElement = this.client.api.element.find('#signupSection');
    assert.strictEqual(signupElement instanceof Element, true);
    assert.strictEqual(await signupElement.getId(), '0');

    const signupWebElement = await signupElement;
    assert.strictEqual(signupWebElement instanceof WebElement, true);
    assert.strictEqual(await signupWebElement.getId(), '0');
  });
});
