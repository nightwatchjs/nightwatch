const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');

describe('element().uncheck() command', function() {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().uncheck() will uncheck checkbox if selected', async function () {
    let nCallsToClick = 0;

    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/click',
      method: 'POST',
      response: JSON.stringify({
        value: null
      }),
      onRequest(_) {
        nCallsToClick++;
      }
    }, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/selected',
      method: 'GET',
      response: JSON.stringify({
        value: true
      })
    }, true);

    // For returning 'checkbox' from getAttribute for type attribute
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: 'checkbox'
      })
    }, true);

    const resultPromise = await this.client.api.element('#signupSection').uncheck();

    // Click command should have been used one time to uncheck
    assert.strictEqual(nCallsToClick, 1);

    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');
  });

  it('test .element().uncheck() will uncheck radio input if selected', async function () {
    let nCallsToClick = 0;

    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/click',
      method: 'POST',
      response: JSON.stringify({
        value: null
      }),
      onRequest(_) {
        nCallsToClick++;
      }
    }, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/selected',
      method: 'GET',
      response: JSON.stringify({
        value: true
      })
    }, true);

    // For returning 'radio' from getAttribute for type attribute
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: 'radio'
      })
    }, true);

    const resultPromise = await this.client.api.element('#signupSection').uncheck();

    // Click command should have been used one time to uncheck
    assert.strictEqual(nCallsToClick, 1);

    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');
  });

  it('test .element().uncheck() will not uncheck if not a checkbox', async function () {
    let nCallsToClick = 0;

    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/click',
      method: 'POST',
      response: JSON.stringify({
        value: null
      }),
      onRequest(_) {
        nCallsToClick++;
      }
    }, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/selected',
      method: 'GET',
      response: JSON.stringify({
        value: true
      })
    }, true);

    // For returning 'submit' from getAttribute for type attribute
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: 'submit'
      })
    }, true);

    const resultPromise = await this.client.api.element('#signupSection').uncheck();

    // Click command should not have been fired
    assert.strictEqual(nCallsToClick, 0);

    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');
  });

  it('test .element().uncheck() will not click if unchecked already', async function () {
    let nCallsToClick = 0;

    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/click',
      method: 'POST',
      response: JSON.stringify({
        value: null
      }),
      onRequest(_) {
        nCallsToClick++;
      }
    }, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/selected',
      method: 'GET',
      response: JSON.stringify({
        value: false
      })
    }, true);

    // For returning 'checkbox' from getAttribute for type attribute
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: 'checkbox'
      })
    }, true);

    const resultPromise = await this.client.api.element('#signupSection').uncheck();

    // Click command should not have been executed since element is unchecked already
    assert.strictEqual(nCallsToClick, 0);
    
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');
  });
});

