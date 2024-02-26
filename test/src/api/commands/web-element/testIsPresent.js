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

  it('should return true if element is present', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/displayed',
      method: 'GET',
      response: JSON.stringify({
        value: true
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').isPresent();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(resultPromise instanceof Promise, true);

    const result = await resultPromise;
    assert.strictEqual(result, true);
  });

  it('should return false if element is not present', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/displayed',
      method: 'GET',
      response: JSON.stringify({
        value: false
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').isPresent();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(resultPromise instanceof Promise, true);

    const result = await resultPromise;
    assert.strictEqual(result, false);
  });

  it('should handle element not found error', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/displayed',
      method: 'GET',
      response: JSON.stringify({
        value: false
      }),
      status: 404
    }, true);

    try {
      await this.client.api.element('#signupSection').isPresent();
      assert.fail('Expected error to be thrown');
    } catch (err) {
      assert.strictEqual(err.name, 'NoSuchElementError');
    }
  });
});
