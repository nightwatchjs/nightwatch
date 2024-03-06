describe('duckduckgo example', function() {

  this.tags = ['end-to-end'];

  it('Search Nightwatch.js and check results', function(browser) {
    browser
      .navigateTo('https://duckduckgo.com')
      .waitForElementVisible('body')
      .assert.visible('input[name="q"]')
      .sendKeys('input[name="q"]', ['Nightwatch.js'])
      .assert.visible('button[type=submit]')
      .click('button[type=submit]')
      .assert.textContains('.react-results--main', 'Nightwatch.js')
      .element('input[type=search]').isPresent(result => {
        // You can add assertions based on the result
        browser.assert.equal(result, true, 'The search input is present');
      });
  });
});
