const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const {ShadowRoot} = require('selenium-webdriver/lib/webdriver.js');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');

describe('element().shadow().find() commands', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().shadow().find()', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/shadow',
        method: 'GET',
        response: JSON.stringify({
          value: {'shadow-6066-11e4-a52e-4f735466cecf': '9'}
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/shadow/9/elements',
        postdata: {
          using: 'css selector',
          value: '#helpBtn'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '5'}]
        })
      }, true);

    const shadowRootEl = this.client.api.element('#signupSection').getShadowRoot();
    assert.strictEqual(await shadowRootEl instanceof ShadowRoot, true);
    assert.strictEqual(await shadowRootEl.getId(), '9');
    
    const helpBtnElement = shadowRootEl.find('#helpBtn');
    assert.strictEqual(helpBtnElement instanceof Element, true);
    assert.strictEqual(await helpBtnElement.getId(), '5');

    const helpBtnWebElement = await helpBtnElement;
    assert.strictEqual(helpBtnWebElement instanceof WebElement, true);
    assert.strictEqual(await helpBtnWebElement.getId(), '5');
  });

  it('test .element().shadow().get()', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/shadow',
        method: 'GET',
        response: JSON.stringify({
          value: {'shadow-6066-11e4-a52e-4f735466cecf': '9'}
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/shadow/9/elements',
        postdata: {
          using: 'css selector',
          value: '#helpBtn'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '5'}]
        })
      }, true);

    const shadowRootEl = this.client.api.element('#signupSection').getShadowRoot();
    assert.strictEqual(await shadowRootEl instanceof ShadowRoot, true);
    assert.strictEqual(await shadowRootEl.getId(), '9');
    
    const helpBtnElement = shadowRootEl.get('#helpBtn');
    assert.strictEqual(helpBtnElement instanceof Element, true);
    assert.strictEqual(await helpBtnElement.getId(), '5');

    const helpBtnWebElement = await helpBtnElement;
    assert.strictEqual(helpBtnWebElement instanceof WebElement, true);
    assert.strictEqual(await helpBtnWebElement.getId(), '5');
  });

  it('test .element().shadow().findElement()', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/shadow',
        method: 'GET',
        response: JSON.stringify({
          value: {'shadow-6066-11e4-a52e-4f735466cecf': '9'}
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/shadow/9/elements',
        postdata: {
          using: 'css selector',
          value: '#helpBtn'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '5'}]
        })
      }, true);

    const shadowRootEl = this.client.api.element('#signupSection').getShadowRoot();
    assert.strictEqual(await shadowRootEl instanceof ShadowRoot, true);
    assert.strictEqual(await shadowRootEl.getId(), '9');
    
    const helpBtnElement = shadowRootEl.findElement('#helpBtn');
    assert.strictEqual(helpBtnElement instanceof Element, true);
    assert.strictEqual(await helpBtnElement.getId(), '5');

    const helpBtnWebElement = await helpBtnElement;
    assert.strictEqual(helpBtnWebElement instanceof WebElement, true);
    assert.strictEqual(await helpBtnWebElement.getId(), '5');
  });

  it('test .element().shadow().find(selectorObject)', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/shadow',
        method: 'GET',
        response: JSON.stringify({
          value: {'shadow-6066-11e4-a52e-4f735466cecf': '9'}
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/shadow/9/elements',
        postdata: {
          using: 'xpath',
          value: '//*[id="helpBtn"]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '2'}]
        })
      }, true);

    const shadowRootEl = this.client.api.element('#signupSection').getShadowRoot();
    assert.strictEqual(await shadowRootEl instanceof ShadowRoot, true);
    assert.strictEqual(await shadowRootEl.getId(), '9');
    
    const helpBtnElement = shadowRootEl.find({
      locateStrategy: 'xpath', selector: '//*[id="helpBtn"]'});
    assert.strictEqual(helpBtnElement instanceof Element, true);
    assert.strictEqual(await helpBtnElement.getId(), '2');

    const helpBtnWebElement = await helpBtnElement;
    assert.strictEqual(helpBtnWebElement instanceof WebElement, true);
    assert.strictEqual(await helpBtnWebElement.getId(), '2');
  });

  it('test .element().shadow().find().getText()', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/shadow',
        method: 'GET',
        response: JSON.stringify({
          value: {'shadow-6066-11e4-a52e-4f735466cecf': '9'}
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/shadow/9/elements',
        postdata: {
          using: 'css selector',
          value: '#helpBtn'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '55'}]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/55/text',
        method: 'GET',
        response: JSON.stringify({
          value: 'Help'
        })
      }, true);

    const shadowRootEl = this.client.api.element('#signupSection').getShadowRoot();
    const helpBtnElement = shadowRootEl.find('#helpBtn');
    const helpBtnTextPromise = helpBtnElement.getText();

    assert.strictEqual(typeof helpBtnTextPromise.then, 'function');
    assert.strictEqual(await helpBtnTextPromise, 'Help');
  });
});
