const assert = require('assert');

describe('custom execute getEmail', function() {
  it('demo test - 1', async function(browser) {
    const result = await browser.getEmail(1);
    
    assert.ok(result instanceof Object);
    assert.deepStrictEqual(result, {
      status: -1,
      error: 'Email not found'
    });
  });

  it('demo test - 2', async function(browser) {
    const result = await browser.getEmail(2);
    
    assert.ok(result instanceof Object);
    assert.strictEqual(result.status, -1);
    assert.strictEqual(result.error.message, 'Error while running .getEmail(): Email not found');
  });

  it('demo test - 3', async function(browser) {
    const result = await browser.getEmail(3);
    assert.strictEqual(result.abortOnFailure, true);
    assert.strictEqual(result.error.message, 'Error while running .getEmail(): Email not found');
  });
});
