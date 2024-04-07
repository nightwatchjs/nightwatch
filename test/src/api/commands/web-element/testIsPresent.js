const assert = require('assert');
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

    const resultPromise = this.client.api.element('#signupSection').isPresent();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result, true, 'Expected element to be present in the DOM');
  });

  it('test .element().isPresent() for element not present', async function() {

    const resultPromise = this.client.api.element('#signupSecti').isPresent();
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');

    assert.strictEqual(resultPromise instanceof Promise, false);
    assert.strictEqual(typeof resultPromise.then, 'function');

    const result = await resultPromise;
    assert.strictEqual(result, false, 'Expected element not to be present in the DOM');
  });

  // Example of a test for an async scenario using .isPresent()
  it('test async .element().isPresent() for element present', async function() {

    const result = await this.client.api.element('#signupSection').isPresent();
    assert.strictEqual(result, true, 'Expected element to be present in the DOM using async/await');
  });

  // Test to ensure .isPresent() correctly handles WebDriver errors
  it('test .element().isPresent() handles errors', async function() {

    const resultPromise = this.client.api.element('#badElement').isPresent();
    const result = await resultPromise;
    assert.strictEqual(result, false, 'Expected .isPresent() to gracefully handle WebDriver errors');
  });
});
