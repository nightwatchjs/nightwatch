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

Given(/^I search "([^"]*)"$/, async function(searchTerm) {
  // FIXME: chaining the click command to the rest of the commands causes an uncaughtRejection in case of an element locate error
  await browser.pause(1000).click('a[aria-label="Search"]');

  return browser.waitForElementVisible('#rijksmuseum-app')
    .setValue('input.search-bar-input[type=text]', [searchTerm, browser.Keys.ENTER])
    .pause(1000);
});

Then(/^the title is "([^"]*)"$/, function(title) {
  return browser.assert.titleEquals(title);
});

Then(/^Body contains "([^"]*)"$/, function(contains) {
  return  browser.assert.textContains('.search-results', contains);
});
