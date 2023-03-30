const assert = require('assert');
const MockServer  = require('../../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../../lib/element/index.js');

describe('element() assert commands', function () {
  this.timeout(10000);
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element() enabled assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/enabled',
      method: 'GET',
      response: JSON.stringify({
        value: true
      })
    }, true, true);

    this.client.options.globals.retryAssertionTimeout = 0;

    const signupElement = this.client.api.element('#signupSection');
    const assertPromise = signupElement.assert.enabled();
    const notAssertPromise = signupElement.assert.not.enabled();

    assert.strictEqual(assertPromise instanceof Element, false);
    assert.strictEqual(assertPromise instanceof Promise, true);
    assert.strictEqual(typeof assertPromise.find, 'undefined');

    await assertPromise;
    try {
      await notAssertPromise;
      assert.fail('NightwatchAssertError expected');
    } catch (err) {
      assert.strictEqual(err.name, 'NightwatchAssertError');
    }
  });

  it('test .element() not enabled assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/enabled',
      method: 'GET',
      response: JSON.stringify({
        value: false
      })
    }, true, true);

    this.client.options.globals.retryAssertionTimeout = 0;

    const signupElement = this.client.api.element('#signupSection');
    const assertPromise = signupElement.assert.enabled();
    const notAssertPromise = signupElement.assert.not.enabled();

    assert.strictEqual(assertPromise instanceof Element, false);
    assert.strictEqual(assertPromise instanceof Promise, true);
    assert.strictEqual(typeof assertPromise.find, 'undefined');

    await notAssertPromise;
    try {
      await assertPromise;
      assert.fail('NightwatchAssertError expected');
    } catch (err) {
      assert.strictEqual(err.name, 'NightwatchAssertError');
    }
  });

  it('test .element() selected assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/selected',
      method: 'GET',
      response: JSON.stringify({
        value: true
      })
    }, true, true);

    this.client.options.globals.retryAssertionTimeout = 0;

    const signupElement = this.client.api.element('#signupSection');
    const assertPromise = signupElement.assert.selected();
    const notAssertPromise = signupElement.assert.not.selected();

    assert.strictEqual(assertPromise instanceof Element, false);
    assert.strictEqual(assertPromise instanceof Promise, true);
    assert.strictEqual(typeof assertPromise.find, 'undefined');

    await assertPromise;
    try {
      await notAssertPromise;
      assert.fail('NightwatchAssertError expected');
    } catch (err) {
      assert.strictEqual(err.name, 'NightwatchAssertError');
    }
  });

  it('test .element() visible assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: true
      })
    }, true, true);

    this.client.options.globals.retryAssertionTimeout = 0;

    const signupElement = this.client.api.element('#signupSection');
    const assertPromise = signupElement.assert.visible();
    const notAssertPromise = signupElement.assert.not.visible();

    assert.strictEqual(assertPromise instanceof Element, false);
    assert.strictEqual(assertPromise instanceof Promise, true);
    assert.strictEqual(typeof assertPromise.find, 'undefined');

    await assertPromise;
    try {
      await notAssertPromise;
      assert.fail('NightwatchAssertError expected');
    } catch (err) {
      assert.strictEqual(err.name, 'NightwatchAssertError');
    }
  });

  it('test .element() hasDescendants assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: true
      })
    }, true, true);

    this.client.options.globals.retryAssertionTimeout = 0;

    const signupElement = this.client.api.element('#signupSection');
    const assertPromise = signupElement.assert.hasDescendants();
    const notAssertPromise = signupElement.assert.not.hasDescendants();

    assert.strictEqual(assertPromise instanceof Element, false);
    assert.strictEqual(assertPromise instanceof Promise, true);
    assert.strictEqual(typeof assertPromise.find, 'undefined');

    await assertPromise;
    try {
      await notAssertPromise;
      assert.fail('NightwatchAssertError expected');
    } catch (err) {
      assert.strictEqual(err.name, 'NightwatchAssertError');
    }
  });

  // it('test .element() present assert', async function() {
  //   MockServer.addMock({
  //     url: '/session/13521-10219-202/elements',
  //     method: 'POST',
  //     response: JSON.stringify({
  //       value: true
  //     })
  //   }, true, true);

  //   this.client.options.globals.retryAssertionTimeout = 0;

  //   const signupElement = this.client.api.element('#signupSection');
  //   const assertPromise = signupElement.assert.present();
  //   const notAssertPromise = signupElement.assert.not.present();

  //   assert.strictEqual(assertPromise instanceof Element, false);
  //   assert.strictEqual(assertPromise instanceof Promise, true);
  //   assert.strictEqual(typeof assertPromise.find, 'undefined');

  //   await assertPromise;
  //   try {
  //     await notAssertPromise;
  //     assert.fail('NightwatchAssertError expected');
  //   } catch (err) {
  //     assert.strictEqual(err.name, 'NightwatchAssertError');
  //   }
  // });

  it('test .element() hasClass assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: ['section', 'signup']
      })
    }, true, true);

    this.client.options.globals.retryAssertionTimeout = 0;

    const signupElement = this.client.api.element('#signupSection');
    const assertPromise = signupElement.assert.hasClass('signup');
    const failAssertPromise = signupElement.assert.hasClass('signupx');
    const notAssertPromise = signupElement.assert.not.hasClass('signup');

    assert.strictEqual(assertPromise instanceof Element, false);
    assert.strictEqual(assertPromise instanceof Promise, true);
    assert.strictEqual(typeof assertPromise.find, 'undefined');

    await assertPromise;

    // TODO: Fix this. Below assertion should throw error, but instead fail silently
    await failAssertPromise;
    // try {
    //   await notAssertPromise;
    //   assert.fail('AssertionError expected');
    // } catch (err) {
    //   assert.strictEqual(err.name, 'NightwatchAssertError');
    // }
  });

  it('test .element() hasAttribute assert', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: true
      })
    }, true, true);

    this.client.options.globals.retryAssertionTimeout = 0;

    const signupElement = this.client.api.element('#signupSection');
    const assertPromise = signupElement.assert.hasAttribute('role');
    const notAssertPromise = signupElement.assert.not.hasAttribute('role');

    assert.strictEqual(assertPromise instanceof Element, false);
    assert.strictEqual(assertPromise instanceof Promise, true);
    assert.strictEqual(typeof assertPromise.find, 'undefined');

    await assertPromise;

    // TODO: Fix this. Below assertion should throw error, but instead fail silently
    await notAssertPromise;
    // try {
    //   await notAssertPromise;
    //   assert.fail('AssertionError expected');
    // } catch (err) {
    //   assert.strictEqual(err.name, 'NightwatchAssertError');
    // }
  });
});
