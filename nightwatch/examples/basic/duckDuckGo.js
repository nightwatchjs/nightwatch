describe('duckduckgo example', function() {
  it('Search Nightwatch.js and check results', function(browser) {
    browser
      .navigateTo('https://duckduckgo.com')
      .waitForElementVisible('input[name=q]')
      .sendKeys('input[name=q]', ['Nightwatch.js'])
      .click('*[type="submit"]')
      .assert.visible('#react-layout')
      .assert.textContains('#react-layout', 'Nightwatch.js');
  });
});
