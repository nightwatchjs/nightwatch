const assert = require('assert');

describe('demo tests with find elements in page commands', function () {
  after(browser => browser.end());

  const pageObject = this.page.workingPageObjPlain();

  it('find elements', function() {
    pageObject
      .navigate()
      .waitForElementPresent('@loginAsString')
      .customFindElements('@loginAsString', function(elements) {
        assert.strictEqual(elements.length, 1);
        assert.strictEqual(elements[0].getId(), '0');
      });
  });

  it('find elements with async/await', async function() {
    const elements = await pageObject.navigate()
      .waitForElementPresent('@loginAsString')
      .customFindElementsES6('@loginAsString');

    assert.strictEqual(elements.length, 1);
    assert.strictEqual(elements[0].getId(), '0');
  });
});
