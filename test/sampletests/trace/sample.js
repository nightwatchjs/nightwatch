describe('Sample test with traceable commands', function() {

  before(browser => {
    browser
      .navigateTo('http://localhost');
  });

  it('click_on_web_login', function(browser) {
    browser
      .assert.visible('#weblogin')
      .click('#weblogin');
  });

  after(browser => browser.end());
});