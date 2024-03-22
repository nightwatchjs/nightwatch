describe('Element Finder', function () {
  before(function (browser) {
    browser.navigateTo('https://github.com/login');
  });

  it('should handle elements not found', function(browser) {
    const result = browser
      .waitForElementVisible('body')
      .element('.auth-form-header2') // Wrong selector name
      .getProperty('innerHTML');

    browser.expect.element('.auth-form-header2').to.not.be.present.before(1000);

    const chained = browser
      .element('.invalid-selector')
      .find('.another-invalid-selector')
      .getText();

    browser.expect(chained).to.be.null;

    browser.expect.element('.non-existent-element').to.not.be.present.before(1000);
  });

  it('should abort test case when abortOnFailure is set', function (browser) {
    browser.options.abortOnFailure = true; // Set abortOnFailure option

    const result = browser
      .waitForElementVisible('body')
      .element('.auth-form-header2') // Wrong selector name
      .getProperty('innerHTML');

    browser.expect.element('.auth-form-header2').to.not.be.present.before(1000);

    // This line should not be reached if the test case is aborted
    browser.assert.fail('Test case should have been aborted');
  });

  after(function (browser) {
    browser.end();
  });
});
