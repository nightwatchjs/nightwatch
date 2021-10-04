const {Given, Then, When, Before} = require('@cucumber/cucumber');

Given(/^I open the Rijksmuseum page$/, function() {
  return browser.navigateTo('https://www.rijksmuseum.nl/en');
});

Given(/^I dismiss the cookie dialog$/, async function() {
  const cookieDialogVisible = await browser.isVisible({
    selector: '.cookie-consent-bar-wrap',
    suppressNotFoundErrors: true
  });

  if (cookieDialogVisible) {
    return browser.click('.cookie-consent-bar-wrap button.link');
  }
});

Given(/^I search "([^"]*)"$/, function(searchTerm) {
  return browser
    .click('a[aria-label="Search"]')
    .waitForElementVisible('#rijksmuseum-app')
    .setValue('input.search-bar-input[type=text]', [searchTerm, browser.Keys.ENTER])
    .pause(1000);
});

Then(/^the title is "([^"]*)"$/, function(title) {
  return browser.assert.title(title);
});

Then(/^Body contains "([^"]*)"$/, function(contains) {
  return  browser.assert.containsText('.search-results', contains);
});