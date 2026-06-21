describe('duckduckgo example', function() {

  this.tags = ['end-to-end'];

  it('Search Nightwatch.js and check results', function(browser) {
    browser
      .navigateTo('https://duckduckgo.com')
      .waitForElementVisible('body')
      .assert.visible('input[name="q"]');

    const input = browser.element('input[name="q"]');
    const submitButton = browser.element('button[type=submit]');

    input.sendKeys(['Nightwatch.js']);
    submitButton.isVisible().assert.equals(true);
    submitButton.click();

    browser.assert.textContains('.react-results--main', 'Nightwatch.js');
  });
});

