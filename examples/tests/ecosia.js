describe('Ecosia.org Demo', function() {

  before(browser => {
    browser
      .navigateTo('https://www.ecosia.org/');
  });

  it('Demo test ecosia.org', function(browser) {
    browser
      .waitForElementVisible('body')
      .assert.titleContains('Ecosia');

    const inputElement = browser.element('input[type=search]');
    const submitButton = browser.element('button[type=submit]');

    inputElement.isVisible().assert.equals(true);
    inputElement.setValue('nightwatch');

    submitButton.isVisible().assert.equals(true);
    submitButton.click();

    browser.assert.textContains('.layout__content', 'Nightwatch.js');
  });

  after(browser => browser.end());
});

