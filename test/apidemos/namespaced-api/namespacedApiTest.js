const common = require('../../common.js');
const {browser, appium, assert, expect, firefox} = common.require('index.js');

describe('namespaced api test', function() {
  it('browser.navigateTo', function () {
    const result = browser.navigateTo('http://localhost');
    assert
      .strictEqual(typeof result.navigateTo, 'function')
      .strictEqual(typeof result.debug, 'function')
      .strictEqual(typeof result.appium.hideKeyboard, 'function')
      .strictEqual(typeof result.sessionId, 'string');
  });

  it('browser.appium.setOrientation', function () {
    const result = browser.appium.setOrientation('LANDSCAPE');
    assert
      .strictEqual(typeof result.navigateTo, 'function')
      .strictEqual(typeof result.debug, 'function')
      .strictEqual(typeof result.appium.hideKeyboard, 'function')
      .strictEqual(typeof result.sessionId, 'string');
  });

  it('appium.setOrientation', function () {
    const result = appium.setOrientation('LANDSCAPE');
    assert
      .strictEqual(typeof result.navigateTo, 'undefined')
      .strictEqual(typeof result.debug, 'undefined')
      .strictEqual(typeof result.hideKeyboard, 'function')
      .strictEqual(typeof result.sessionId, 'undefined');
  });

  it('assert.titleEquals', function () {
    const result = assert.titleEquals('Localhost');
    result
      .throws(() => {
        result.navigateTo();
      }, new Error('Unknown api method "navigateTo".'))
      .throws(() => {
        result.debug();
      }, new Error('Unknown api method "debug".'))
      .throws(() => {
        result.sessionId();
      }, new Error('Unknown api method "sessionId".'))
      .titleEquals('Localhost');
  });

  it('assert.strictEqual', function () {
    const result = assert.strictEqual(2, 2);
    result
      .throws(() => {
        result.navigateTo();
      }, new Error('Unknown api method "navigateTo".'))
      .throws(() => {
        result.debug();
      }, new Error('Unknown api method "debug".'))
      .throws(() => {
        result.sessionId();
      }, new Error('Unknown api method "sessionId".'))
      .titleEquals('Localhost');
  });

  it('expect assertions', function () {
    expect(2).to.equal(2);
    expect.title().to.equal('Localhost');
  });

  it('firefox.getContext', function () {
    const result = firefox.getContext();
    assert
      .strictEqual(typeof result.navigateTo, 'undefined')
      .strictEqual(typeof result.debug, 'undefined')
      .strictEqual(typeof result.hideKeyboard, 'undefined')
      .strictEqual(typeof result.sessionId, 'undefined')
      .strictEqual(typeof result.installAddon, 'function');
  });

  it('browser.navigateTo async', async function () {
    const result = browser.navigateTo('http://localhost');
    assert
      .strictEqual(typeof result.navigateTo, 'function')
      .strictEqual(typeof result.debug, 'function')
      .strictEqual(typeof result.appium.hideKeyboard, 'function')
      .strictEqual(typeof result.sessionId, 'string');

    assert.strictEqual(await result, null);
  });

  it('browser.appium.setOrientation async', async function () {
    const result = browser.appium.setOrientation('LANDSCAPE');
    assert
      .strictEqual(typeof result.navigateTo, 'function')
      .strictEqual(typeof result.debug, 'function')
      .strictEqual(typeof result.appium.hideKeyboard, 'function')
      .strictEqual(typeof result.sessionId, 'string');

    assert.strictEqual(await result, null);
  });

  it('appium.setOrientation async', async function () {
    const result = appium.setOrientation('LANDSCAPE');
    assert
      .strictEqual(typeof result.navigateTo, 'undefined')
      .strictEqual(typeof result.debug, 'undefined')
      .strictEqual(typeof result.hideKeyboard, 'function')
      .strictEqual(typeof result.sessionId, 'undefined');

    assert.strictEqual(await result, null);
  });

  it('assert.titleEquals async', async function () {
    const result = assert.titleEquals('Localhost');
    result
      .strictEqual(typeof result.navigateTo, 'undefined')
      .strictEqual(typeof result.debug, 'undefined')
      .strictEqual(typeof result.hideKeyboard, 'undefined')
      .strictEqual(typeof result.sessionId, 'undefined')
      .titleEquals('Localhost')
      .strictEqual(await result, 'Localhost');
  });

  it('assert.strictEqual async', async function () {
    const result = assert.strictEqual(2, 2);
    result
      .strictEqual(typeof result.navigateTo, 'undefined')
      .strictEqual(typeof result.debug, 'undefined')
      .strictEqual(typeof result.hideKeyboard, 'undefined')
      .strictEqual(typeof result.sessionId, 'undefined')
      .titleEquals('Localhost')
      .deepStrictEqual(await result, {returned: 1, value: null});
  });
});
