const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const {ShadowRoot} = require('selenium-webdriver/lib/webdriver.js');
const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');

describe('element().shadow().findAll() commands', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().shadow().findAll()', async function() {
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
          value: '.btn'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [
            {'element-6066-11e4-a52e-4f735466cecf': '5'},
            {'element-6066-11e4-a52e-4f735466cecf': '6'},
            {'element-6066-11e4-a52e-4f735466cecf': '7'}
          ]
        })
      }, true);

    const shadowRootEl = this.client.api.element('#signupSection').getShadowRoot();
    assert.strictEqual(await shadowRootEl instanceof ShadowRoot, true);
    assert.strictEqual(await shadowRootEl.getId(), '9');

    const btnElements = shadowRootEl.findAll('.btn');
    assert.strictEqual(btnElements instanceof Element, false);
    assert.strictEqual(typeof btnElements.find, 'undefined');
    assert.strictEqual(typeof btnElements.click, 'undefined');

    assert.strictEqual(btnElements instanceof Promise, false);
    assert.strictEqual(typeof btnElements.then, 'function');
    assert.strictEqual(typeof btnElements.nth, 'function');
    assert.strictEqual(typeof btnElements.count, 'function');

    const btnWEbElements = await btnElements;
    assert.strictEqual(btnWEbElements.length, 3);
    assert.strictEqual(btnWEbElements[0] instanceof WebElement, true);
    assert.strictEqual(await btnWEbElements[0].getId(), '5');
    assert.strictEqual(await btnElements.nth(0).getId(), '5');
  });

  it('test .element().shadow().getAll()', async function() {
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
          value: '.btn'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [
            {'element-6066-11e4-a52e-4f735466cecf': '5'},
            {'element-6066-11e4-a52e-4f735466cecf': '6'},
            {'element-6066-11e4-a52e-4f735466cecf': '7'}
          ]
        })
      }, true);

    const shadowRootEl = this.client.api.element('#signupSection').getShadowRoot();
    assert.strictEqual(await shadowRootEl instanceof ShadowRoot, true);
    assert.strictEqual(await shadowRootEl.getId(), '9');

    const btnElements = shadowRootEl.getAll('.btn');
    assert.strictEqual(btnElements instanceof Element, false);
    assert.strictEqual(typeof btnElements.find, 'undefined');
    assert.strictEqual(typeof btnElements.click, 'undefined');

    assert.strictEqual(btnElements instanceof Promise, false);
    assert.strictEqual(typeof btnElements.then, 'function');
    assert.strictEqual(typeof btnElements.nth, 'function');
    assert.strictEqual(typeof btnElements.count, 'function');

    const btnWEbElements = await btnElements;
    assert.strictEqual(btnWEbElements.length, 3);
    assert.strictEqual(btnWEbElements[0] instanceof WebElement, true);
    assert.strictEqual(await btnWEbElements[0].getId(), '5');
    assert.strictEqual(await btnElements.nth(0).getId(), '5');
  });

  it('test .element().shadow().findElements()', async function() {
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
          value: '.btn'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [
            {'element-6066-11e4-a52e-4f735466cecf': '5'},
            {'element-6066-11e4-a52e-4f735466cecf': '6'},
            {'element-6066-11e4-a52e-4f735466cecf': '7'}
          ]
        })
      }, true);

    const shadowRootEl = this.client.api.element('#signupSection').getShadowRoot();
    assert.strictEqual(await shadowRootEl instanceof ShadowRoot, true);
    assert.strictEqual(await shadowRootEl.getId(), '9');

    const btnElements = shadowRootEl.findElements('.btn');
    assert.strictEqual(btnElements instanceof Element, false);
    assert.strictEqual(typeof btnElements.find, 'undefined');
    assert.strictEqual(typeof btnElements.click, 'undefined');

    assert.strictEqual(btnElements instanceof Promise, false);
    assert.strictEqual(typeof btnElements.then, 'function');
    assert.strictEqual(typeof btnElements.nth, 'function');
    assert.strictEqual(typeof btnElements.count, 'function');

    const btnWEbElements = await btnElements;
    assert.strictEqual(btnWEbElements.length, 3);
    assert.strictEqual(btnWEbElements[0] instanceof WebElement, true);
    assert.strictEqual(await btnWEbElements[0].getId(), '5');
    assert.strictEqual(await btnElements.nth(0).getId(), '5');
  });

  it('test .element().shadow().findAll(selectorObject)', async function() {
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
          value: [
            {'element-6066-11e4-a52e-4f735466cecf': '4'},
            {'element-6066-11e4-a52e-4f735466cecf': '5'}
          ]
        })
      }, true);

    const shadowRootEl = this.client.api.element('#signupSection').getShadowRoot();
    assert.strictEqual(await shadowRootEl instanceof ShadowRoot, true);
    assert.strictEqual(await shadowRootEl.getId(), '9');

    const helpBtnElements = shadowRootEl.findAll({
      locateStrategy: 'xpath', selector: '//*[id="helpBtn"]'
    });
    assert.strictEqual(helpBtnElements instanceof Element, false);
    assert.strictEqual(typeof helpBtnElements.find, 'undefined');
    assert.strictEqual(typeof helpBtnElements.click, 'undefined');

    assert.strictEqual(helpBtnElements instanceof Promise, false);
    assert.strictEqual(typeof helpBtnElements.then, 'function');
    assert.strictEqual(typeof helpBtnElements.nth, 'function');
    assert.strictEqual(typeof helpBtnElements.count, 'function');

    const btnWEbElements = await helpBtnElements;
    assert.strictEqual(btnWEbElements.length, 2);
    assert.strictEqual(btnWEbElements[0] instanceof WebElement, true);
    assert.strictEqual(await btnWEbElements[0].getId(), '4');
    assert.strictEqual(await helpBtnElements.nth(0).getId(), '4');
  });

  it('test .element().shadow().findAll().count()', async function() {
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
          value: '.btn'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [
            {'element-6066-11e4-a52e-4f735466cecf': '5'},
            {'element-6066-11e4-a52e-4f735466cecf': '6'},
            {'element-6066-11e4-a52e-4f735466cecf': '7'}
          ]
        })
      }, true);

    const shadowRootEl = this.client.api.element('#signupSection').getShadowRoot();
    assert.strictEqual(await shadowRootEl instanceof ShadowRoot, true);
    assert.strictEqual(await shadowRootEl.getId(), '9');

    const resultPromise = shadowRootEl.findAll('.btn').count();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');
    assert.strictEqual(typeof resultPromise.value, 'object');
    assert.strictEqual(typeof resultPromise.assert, 'object');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, false);
    assert.strictEqual(result, 3);

    assert.strictEqual(await resultPromise.value, 3);
    assert.strictEqual(await resultPromise.assert.equals(3), 3);
    assert.strictEqual(await resultPromise.assert.not.equals(4), 3);
  });

  it('test .element().findAll().nth()', async function() {
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
          value: '.btn'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [
            {'element-6066-11e4-a52e-4f735466cecf': '5'},
            {'element-6066-11e4-a52e-4f735466cecf': '6'},
            {'element-6066-11e4-a52e-4f735466cecf': '7'}
          ]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/6/elements',
        postdata: {
          using: 'css selector',
          value: 'span'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [
            {'element-6066-11e4-a52e-4f735466cecf': '9'}
          ]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/6/property/role',
        method: 'GET',
        response: JSON.stringify({
          value: 'button'
        })
      }, true);

    const shadowRootEl = this.client.api.element('#signupSection').getShadowRoot();
    assert.strictEqual(await shadowRootEl instanceof ShadowRoot, true);
    assert.strictEqual(await shadowRootEl.getId(), '9');

    const btnElement = shadowRootEl.findAll('.btn').nth(1);
    assert.strictEqual(btnElement instanceof Element, false);
    assert.strictEqual(btnElement instanceof Promise, true);
    assert.strictEqual(typeof btnElement.find, 'function');
    assert.strictEqual(typeof btnElement.getValue, 'function');

    const btnWebElement = await btnElement;
    assert.strictEqual(btnWebElement instanceof WebElement, true);
    assert.strictEqual(await btnWebElement.getId(), '6');

    const btnSpanElement = btnElement.find('span');
    assert.strictEqual(await btnSpanElement.getId(), '9');

    const btnElementProperty = await btnElement.getProperty('role');
    assert.strictEqual(btnElementProperty, 'button');
  });
});

