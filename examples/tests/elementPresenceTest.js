module.exports = {
  'Demo Test for .isPresent()': async function(browser) {
    await browser.url('https://www.selenium.dev/selenium/web/formPage.html');

    // Checking for the presence of an element that exists
    await browser.isPresent('#checky', function(result) {
      this.assert.ok(result.value, 'checky element is present.');
    });

    // Checking for the presence of an element that exists
    await browser.isPresent('#multi', function(result) {
      this.assert.ok(result.value, 'multi element is present.');
    });

    // Checking for the presence of an element that does not exist
    await browser.isPresent('.non-existent-element', function(result) {
      this.assert.ok(!result.value, 'Non-existent element is not present.');
    });

    browser.end();
  }
};

