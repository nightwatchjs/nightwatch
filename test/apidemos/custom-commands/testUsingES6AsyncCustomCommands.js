describe('Test Using ES6 Async Custom Commands', function() {
  before(browser => {
    browser
      .url('http://localhost')
      .waitForElementPresent('#weblogin')
      .customFindElementsES6('#weblogin', function(elements) {
        this.assert.ok(Array.isArray(elements));
      });
  });

  it('sampleTest', browser => {
    browser.end();
  });
});


