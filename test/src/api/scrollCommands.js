const assert = require('assert');

module.exports = {
  '@tags': ['scroll'],
  'Scroll Commands Test': function(browser) {
    browser
      .url('https://example.com')
      .waitForElementVisible('body');

    // Test scrollTo
    browser.scrollTo(0, 1000, function(result) {
      assert.strictEqual(result.status, 0);
    });

    // Test scrollIntoView
    browser.scrollIntoView('h1', function(result) {
      assert.strictEqual(result.status, 0);
    });

    // Test scrollToBottom
    browser.scrollToBottom(function(result) {
      assert.strictEqual(result.status, 0);
    });

    // Test scrollToTop
    browser.scrollToTop(function(result) {
      assert.strictEqual(result.status, 0);
    });

    // Test scrollTo with options
    browser.scrollTo({
      left: 0,
      top: 500,
      behavior: 'smooth'
    }, function(result) {
      assert.strictEqual(result.status, 0);
    });

    // Test scrollIntoView with options
    browser.scrollIntoView('h1', {
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    }, function(result) {
      assert.strictEqual(result.status, 0);
    });

    browser.end();
  }
}; 