const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('.element() commands', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element()', async function() {
    const signupElement = this.client.api.element('#signupSection');
    assert.strictEqual(signupElement instanceof Element, true);
    assert.strictEqual(await signupElement.getId(), '0');
    assert.strictEqual(typeof signupElement.find, 'function');
    assert.strictEqual(typeof signupElement.findByRole, 'function');
    assert.strictEqual(typeof signupElement.assert, 'object');

    const signupWebElement = await signupElement;
    assert.strictEqual(signupWebElement instanceof WebElement, true);
    assert.strictEqual(await signupWebElement.getId(), '0');
    assert.strictEqual(typeof signupWebElement.find, 'undefined');
    assert.strictEqual(typeof signupWebElement.assert, 'undefined');
    assert.strictEqual(typeof signupWebElement.click, 'function');
    assert.strictEqual(typeof signupWebElement.sendKeys, 'function');
    assert.strictEqual(typeof signupWebElement.getDriver, 'function');
  });
});
