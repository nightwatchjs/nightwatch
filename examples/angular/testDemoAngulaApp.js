describe('Angular Demo Example', () => {
  const firstInput = 'input[ng-model=\'first\']';
  const secondInput = 'input[ng-model=\'second\']';

  beforeEach((browser) => {
    browser.url('https://vaibhavsingh97.com/angular-demo/').waitForElementVisible('body');
  });

  let addvalues = (browser, a, b) => {
    browser.setValue(firstInput, a);
    browser.setValue(secondInput, b);
    browser.click('#gobutton');
  };

  test('should have a title', (browser) => {
    browser.assert.titleContains('Super Calculator');
  });

  test('should add one and two', (browser) => {
    browser.assert
      .visible('input[ng-model=\'first\']')
      .assert.visible('input[ng-model=\'second\']')
      .setValue('input[ng-model=\'first\']', 1)
      .setValue('input[ng-model=\'second\']', 2)
      .click('#gobutton')
      .assert.containsText('h2.ng-binding', 3);
  });

  test('should read the value from both the input', (browser) => {
    browser
      .setValue('input[ng-model=\'first\']', 5)
      .setValue('input[ng-model=\'second\']', 4)
      .assert.attributeContains('input[ng-model=\'first\']', 'value', 5)
      .assert.attributeContains('input[ng-model=\'second\']', 'value', 4);
  });

  test('should have a history', (browser) => {
    addvalues(browser, 10, 10);
    browser.assert.containsText('h2.ng-binding', 20);
    addvalues(browser, 20, 20);
    browser.assert.containsText('h2.ng-binding', 40);
    addvalues(browser, 30, 30);
    browser.assert.containsText('h2.ng-binding', 60);
    browser.expect.elements('tr[ng-repeat="result in memory"]').count.to.equal(3);
  });

  after((browser) => browser.end());
});
