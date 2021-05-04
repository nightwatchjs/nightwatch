describe('Angular Demo Example', () => {
  test('should have a title', (browser) => {
    browser
      .url('https://vaibhavsingh97.com/angular-demo/')
      .waitForElementVisible('body')
      .assert.titleContains('Super Calculator');
  });

  test('should add one and two', (browser) => {
    browser
      .url('https://vaibhavsingh97.com/angular-demo/')
      .waitForElementVisible('body')
      .assert.visible("input[ng-model='first']")
      .assert.visible("input[ng-model='second']")
      .setValue("input[ng-model='first']", 1)
      .setValue("input[ng-model='second']", 2)
      .click('#gobutton')
      .assert.containsText('h2.ng-binding', 3);
  });

  after((browser) => browser.end());
});
