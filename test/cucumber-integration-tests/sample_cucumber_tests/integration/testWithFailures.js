const {Given, Then} = require('@cucumber/cucumber');

Given('I navigate to localhost', function() {
  browser.globals.test_calls++;
  return browser.url('http://localhost');
});

Then('I check if badElement is present', function() {
  browser.globals.test_calls++;
  return browser.assert.elementPresent('#badElement');
});