const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');
describe('element().isPresent() command', function() {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().isPresent() present', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/present',
      method: 'GET',
      response: JSON.stringify({
        value: true
      })
    }, true);

    this.client.api.element('#search').isPresent(function (result) {
      this.assert.equal(result.value, true);
    });
  });

  it('test .element().isPresent() not present', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/present',
      method: 'GET',
      response: JSON.stringify({
        value: false
      })
    }, true);

    this.client.api.element('#search').isPresent(function (result) {
      this.assert.equal(result.value, false);
    });
  });
  it('test .element().find().isPresent() not present', async function () {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/present',
      method: 'GET',
      response: JSON.stringify({
        value: false
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').isPresent();
    assert.strictEqual(resultPromise instanceof WebElement, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    // assert.strictEqual(resultPromise instanceof ShadowRoot, false);
    // assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result, null);
  });
});