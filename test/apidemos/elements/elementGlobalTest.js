const assert = require('assert');
const {WebElement} = require('selenium-webdriver');

describe('get text using element-global', function () {
  const signupSection = element(by.css('#signupSection'));

  after(browser => browser.end());

  const availableElementCommands = [
    'getId',
    'findElement',
    'findElements',
    'click',
    'sendKeys',
    'getTagName',
    'getCssValue',
    'getAttribute',
    'getProperty',
    'getText',
    'getAriaRole',
    'getAccessibleName',
    'getRect',
    'isEnabled',
    'isSelected',
    'submit',
    'clear',
    'isDisplayed',
    'takeScreenshot',
    'getWebElement'
  ];

  test('element globals command',  async function() {
    const weblogin = element('#weblogin');
    const tagName = await browser.waitForElementPresent(weblogin, 100).getTagName(weblogin);
    assert.strictEqual(tagName, 'div');

    browser.assert.visible(weblogin);

    await expect(weblogin).to.be.visible;
    await expect.element('#weblogin').text.contains('sample');

    const webElement = await weblogin.getWebElement();
    assert.ok(webElement instanceof WebElement);

    availableElementCommands.forEach(command => {
      assert.strictEqual(typeof weblogin[command], 'function');
    });

    const result = await weblogin.getText();
    assert.strictEqual(result, 'sample text');

    const signupSectionId = await signupSection.getId();
    assert.strictEqual(signupSectionId, '0');
  });

});
