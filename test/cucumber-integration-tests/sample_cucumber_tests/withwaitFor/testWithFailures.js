const {Given, Then} = require('@cucumber/cucumber');

Given('I navigate to localhost', function() {
  browser.globals.test_calls++;

  return browser.url('http://localhost');
});

Then('I wait for badElement to be present', function() {
  browser.globals.test_calls++;

  return browser.waitForElementPresent('#badElement');
});