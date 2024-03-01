const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');

describe('element().isVisible() command', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().isVisible() Visible', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/Visible',
      method: 'GET',
      response: JSON.stringify({
        value: true
      })
    }, true);

    this.client.api.element('#search').isVisible(function(result) {
      this.assert.equal(result.value, true);
    });
  });

  it('test .element().isVisible() not Visible', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/Visible',
      method: 'GET',
      response: JSON.stringify({
        value: false
      })
    }, true);

    this.client.api.element('#search').isVisible(function(result) {
      this.assert.equal(result.value, true);
    });
  });

  it('test .element().find().isVisible() not visible', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/displayed',
      method: 'GET',
      response: JSON.stringify({
        value: false
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').isVisible();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result, false);
  });
});