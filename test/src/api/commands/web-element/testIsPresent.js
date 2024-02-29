const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');

describe('element().isPresent() command', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().isPresent() for element present', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element',
      method: 'POST',
      response: JSON.stringify({
        value: {ELEMENT: '0'} // Simulate element found
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').isPresent();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result, true, 'Expected element to be present in the DOM');
  });

  it('test .element().isPresent() for element not present', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element',
      method: 'POST',
      response: JSON.stringify({
        value: null // Simulate element not found
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').isPresent();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result, false, 'Expected element not to be present in the DOM');
  });

  // Example of a test for an async scenario using .isPresent()
  it('test async .element().isPresent() for element present', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element',
      method: 'POST',
      response: JSON.stringify({
        value: {ELEMENT: '0'} // Again, simulate element found
      })
    }, true);

    const result = await this.client.api.element('#signupSection').isPresent();
    assert.strictEqual(result, true, 'Expected element to be present in the DOM using async/await');
  });

  // Test to ensure .isPresent() correctly handles WebDriver errors
  it('test .element().isPresent() handles errors', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element',
      method: 'POST',
      response: {
        statusCode: 404,
        body: JSON.stringify({
          value: {error: 'no such element', message: 'An element could not be located on the page using the given search parameters.'}
        })
      }
    }, true);

    const resultPromise = this.client.api.element('#signupSection').isPresent();
    const result = await resultPromise;
    assert.strictEqual(result, false, 'Expected .isPresent() to gracefully handle WebDriver errors');
  });
});
