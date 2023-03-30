const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('element().findAll() commands', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().findAll()', async function() {
    const btnElements = this.client.api.element('#signupSection').findAll('.btn');
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
    assert.strictEqual(await btnWEbElements[0].getId(), '1');
  });

  it('test .element().getAll()', async function() {
    const btnElements = this.client.api.element('#signupSection').getAll('.btn');
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
    assert.strictEqual(await btnWEbElements[0].getId(), '1');
  });

  it('test .element().findElements()', async function() {
    const btnElements = this.client.api.element('#signupSection').findElements('.btn');
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
    assert.strictEqual(await btnWEbElements[0].getId(), '1');
  });

  it('test .element().findAll(selectorObject)', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/elements',
      postdata: {
        using: 'xpath',
        value: '//*[id="helpBtn"]'
      },
      method: 'POST',
      response: JSON.stringify({
        value: [
          {'element-6066-11e4-a52e-4f735466cecf': '2'},
          {'element-6066-11e4-a52e-4f735466cecf': '3'}
        ]
      })
    }, true);

    const helpBtnElements = this.client.api.element('#signupSection').findAll({
      locateStrategy: 'xpath', selector: '//*[id="helpBtn"]'});
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
    assert.strictEqual(await btnWEbElements[0].getId(), '2');
  });

  it('test .element.findAll()', async function() {
    const webLoginElements = this.client.api.element.findAll('#weblogin');
    assert.strictEqual(webLoginElements instanceof Element, false);
    assert.strictEqual(typeof webLoginElements.find, 'undefined');
    assert.strictEqual(typeof webLoginElements.click, 'undefined');

    assert.strictEqual(webLoginElements instanceof Promise, false);
    assert.strictEqual(typeof webLoginElements.then, 'function');
    assert.strictEqual(typeof webLoginElements.nth, 'function');
    assert.strictEqual(typeof webLoginElements.count, 'function');

    const btnWEbElements = await webLoginElements;
    assert.strictEqual(btnWEbElements.length, 2);
    assert.strictEqual(btnWEbElements[0] instanceof WebElement, true);
    assert.strictEqual(await btnWEbElements[0].getId(), '5cc459b8-36a8-3042-8b4a-258883ea642b');
  });

  it('test .element().findAll().count()', async function() {
    const resultPromise = this.client.api.element('#signupSection').findAll('.btn').count();
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
        url: '/session/13521-10219-202/element/2/elements',
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
        url: '/session/13521-10219-202/element/2/property/role',
        method: 'GET',
        response: JSON.stringify({
          value: 'button'
        })
      }, true);

    const btnElement = this.client.api.element('#signupSection').findAll('.btn').nth(1);
    assert.strictEqual(btnElement instanceof Element, false);
    assert.strictEqual(btnElement instanceof Promise, true);
    assert.strictEqual(typeof btnElement.find, 'function');
    assert.strictEqual(typeof btnElement.getValue, 'function');

    const btnWebElement = await btnElement;
    assert.strictEqual(btnWebElement instanceof WebElement, true);
    assert.strictEqual(await btnWebElement.getId(), '2');

    const btnSpanElement = btnElement.find('span');
    assert.strictEqual(await btnSpanElement.getId(), '9');

    const btnElementProperty = await btnElement.getProperty('role');
    assert.strictEqual(btnElementProperty, 'button');
  });
});
