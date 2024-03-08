browser.addCommand('isDisplayed', function(selector, callback) {
  return this.isVisible(selector, callback);
});
describe('Ecosia.org Demo', function() {

  before(browser => {
    browser
      .navigateTo('https://www.ecosia.org/');
  });

  it('Demo test ecosia.org', function(browser) {
    browser
      .waitForElementVisible('body')
      .assert.titleContains('Ecosia')
      .assert.visible('input[type=search]')
      .setValue('input[type=search]', 'nightwatch')
      .assert.visible('button[type=submit]')
      .click('button[type=submit]')
      .assert.textContains('.layout__content', 'Nightwatch.js');
  });
  it('Check if input field is displayed', function(browser) {
    browser
      .isDisplayed('input[type=search]', function(result) {
        this.assert.equal(result.value, true, 'Input field should be displayed');
      });
  });

  it('Check if search button is displayed', function(browser) {
    browser
      .isDisplayed('button[type=submit]', function(result) {
        this.assert.equal(result.value, true, 'Search button should be displayed');
      });
  });
  after(browser => browser.end());
});
