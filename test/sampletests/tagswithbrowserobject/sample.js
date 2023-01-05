describe('Sample test with tags and global browser object', function() {
  const globals = browser.globals;
  this.tags = ['browser'];
  it('demoTagTest', function(browser) {
    browser
      .url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  });
});