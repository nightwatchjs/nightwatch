const assert = require('assert');
const {WebElement} = require('selenium-webdriver');

describe('element-global demo for locateStrategy', function () {
  after(browser => browser.end());

  test('to determine whether or not globally set locate-strategy is ignored',  async function() {
    const weblogin = element('//weblogin');
    const webElement = await weblogin.getWebElement();

    assert.ok(webElement instanceof WebElement);
    assert.strictEqual(weblogin.locateStrategy, 'use_xpath');
    assert.strictEqual(browser.options.use_xpath, true);
  });
  
});
