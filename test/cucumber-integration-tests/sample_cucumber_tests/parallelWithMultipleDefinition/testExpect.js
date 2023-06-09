const {Then} = require('@cucumber/cucumber');


Then('I check if webdriver is present and contains text', async function() {
  browser.globals.test_calls++;

  await browser.expect.element('#webdriver').text.to.contain('xx');
});
