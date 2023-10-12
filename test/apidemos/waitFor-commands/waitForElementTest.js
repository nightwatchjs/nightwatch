describe('test wait for element commands', function() {
  it('waitForElementVisible command - failure', function() {
    browser.waitForElementVisible('#weblogin', 100, 90, false);
  });

  it('waitForElementNotVisible command - failure', function() {
    browser.waitForElementNotVisible('#badElement', 100, 90, false);
  });
});