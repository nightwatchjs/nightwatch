const {Select} = require('selenium-webdriver');

module.exports = {
  before(browser) {
    browser.url('https://www.selenium.dev/selenium/web/formPage.html');
  },

  async demoTest(browser) {
    const selectElement = browser.element('select[name=selectomatic]');

    await browser
      .perform(async function() {
        const selectWebElement = await selectElement; // `Select` class expects a WebElement

        const select = new Select(selectWebElement);

        await select.selectByVisibleText('Four');
      })
      .assert.selected(await selectElement.findElement('option[value=four]'), 'Forth option is selected');
  }
};
