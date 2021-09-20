const {Given, Then, When, Before} = require('@cucumber/cucumber');


Given(/^I open Google page$/, {timeout: -1}, function(){
  return browser.url('https://google.com');
});

Given(/^I search nightwatchjs$/, function() {
  return browser
    .setValue('input[name=q]', ['nightwatch', browser.Keys.ENTER])
    .pause(1000);

});

Then(/^the title is "([^"]*)"$/, function(title){
  return  browser.assert.title(title);
});

Then(/^Body contains nightwatchjs$/, function() {
  return  browser.assert.containsText('#main', 'Nightwatch.js');
});