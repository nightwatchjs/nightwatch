const assert = require('assert');
const {Given, Then, After} = require('@cucumber/cucumber');

Given('I navigate to localhost', function() {
  browser.globals.test_calls++;

  return browser.navigateTo('http://localhost');
});

Then('I check if webdriver is present', function() {
  browser.globals.test_calls++;

  return browser.assert.elementPresent('#webdriver');
});

Then('I check if badElement is present', function() {
  browser.globals.test_calls++;

  return browser.assert.elementPresent('#badElement');
});

Then('text equal Barn owl', function(){
  browser.globals.test_calls++;

  return browser.expect.element('#webdriver').text.to.equal('BarnOwl');
});

After(function() {
  assert.strictEqual(browser.globals.test_calls, 3);
});