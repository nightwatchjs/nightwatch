describe('Authentication Tests', function () {
  beforeEach((browser) => browser.navigateTo('https://www.bstackdemo.com'));

  it('Login test', function () {
    browser
      .click('#signin')
      .setValue('#username input', ['demouser', browser.Keys.ENTER])
      .setValue('#password input', ['testingisfun99', browser.Keys.ENTER])
      .click('#login-btn')
      .assert.textEquals('.username', 'demouser', 'demouser had logged in successfuly.');
  });

  it('Locked account test', function () {
    browser
      .click('#signin')
      .setValue('#username input', ['locked_user', browser.Keys.ENTER])
      .setValue('#password input', ['testingisfun99', browser.Keys.ENTER])
      .click('#login-btn')
      .assert.textContains('.api-error', 'Your account has been locked.');
  });

  afterEach((browser) => browser.end());
});
