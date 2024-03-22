const assert = require('assert');

describe('Test using custom commands with returnFn', function() {
  before(browser => {
    browser
      .url('http://localhost');
  });

  it('sampleTest', browser => {
    const result = browser.customCommandReturnFn();
    assert.deepStrictEqual(result, {status: 0});
    browser.end();
  });
});
