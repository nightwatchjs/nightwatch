const {Given, Then} = require('@cucumber/cucumber');

Given('I navigate to localhost', function() {
  return browser.url('http://localhost');
});

Then('I check if webdriver is present', function() {
  return browser.assert.elementPresent('#webdriver');
});

Then('I check if badElement is present', function() {
  return browser.assert.elementPresent('#badElement');
});