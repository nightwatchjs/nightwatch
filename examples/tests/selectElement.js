const {Select} = require('selenium-webdriver');

module.exports = {
  async demoTest(browser) {
    const selectElement = browser.element('select[name=selectomatic]');

    await browser
      .url('https://www.selenium.dev/selenium/web/formPage.html')
      .perform(async function() {
        const select = new Select(selectElement);

        await select.selectByVisibleText('Four');
      })
      .assert.selected(await selectElement.findElement('option[value=four]'), 'Forth option is selected');
  }
};
