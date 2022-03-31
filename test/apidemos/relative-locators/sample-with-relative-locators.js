/* eslint-disable no-undef */
describe('sample with relative locators', function () {
  it('locate password input', function (browser) {
    const passwordElement = locateWith(By.tagName('input')).below(By.css('input[type=email]'));

    browser
      .waitForElementVisible(passwordElement)
      .expect.element(passwordElement).to.be.an('input');

    browser.setValue(passwordElement, 'password');
  });
});