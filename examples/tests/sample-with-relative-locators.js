/* eslint-disable no-undef */
describe('sample with relative locators', function () {
  before(browser => browser.navigateTo('https://archive.org/account/login'));

  it('locate password input', function (browser) {
    const passwordElement = locateWith(By.tagName('input')).below(By.css('input[type=email]'));

    browser
      .waitForElementVisible(passwordElement)
      .expect.element(passwordElement).to.be.an('input');

    browser.expect.element(passwordElement).attribute('type').equal('password');
  });

  it('fill in password input', function (browser) {
    const passwordElement = locateWith(By.tagName('input')).below(By.css('input[type=email]'));

    browser
      .waitForElementVisible('form.login-form')
      .setValue(passwordElement, 'password')
      .assert.valueEquals('input[type=password]', 'password');
  });

  after(browser => browser.end());
});