const assert = require('assert');

describe('find elements using es6 custom command', function () {
  after(browser => browser.end());

  test('find elements', function() {
    browser
      .waitForElementPresent('#weblogin', 100)
      .es6async.customFindElementsES6('#weblogin', function(elements) {
        assert.strictEqual(elements.length, 1);
        assert.strictEqual(elements[0].getId(), '0');
      })
      .es6async.customFindElements('#weblogin', function(elements) {
        assert.strictEqual(elements.length, 1);
        assert.strictEqual(elements[0].getId(), '0');
      });
  });

});
