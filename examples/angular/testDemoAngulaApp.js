describe('Angular Demo Example', () => {
  beforeEach((browser) => browser.url('https://vaibhavsingh97.com/angular-demo/'));

  test('should have a title', (browser) => {
    browser.waitForElementVisible('body').assert.titleContains('Super Calculator');
  });

  test('should add one and two', (browser) => {
    browser
      .waitForElementVisible('body')
      .assert.visible("input[ng-model='first']")
      .assert.visible("input[ng-model='second']")
      .setValue("input[ng-model='first']", 1)
      .setValue("input[ng-model='second']", 2)
      .click('#gobutton')
      .assert.containsText('h2.ng-binding', 3);
  });

  test('should read the value from both the input', (browser) => {
    browser
      .waitForElementVisible('body')
      .setValue("input[ng-model='first']", 5)
      .setValue("input[ng-model='second']", 4)
      .assert.attributeContains("input[ng-model='first']", 'value', 5)
      .assert.attributeContains("input[ng-model='second']", 'value', 4);
  });

  after((browser) => browser.end());
});
