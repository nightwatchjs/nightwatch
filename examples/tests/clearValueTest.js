describe('clearValue Demo', function() {

  before(browser => {
    browser
      .navigateTo('https://sandbox.mabl.com/mailbox');
  });

  it('Clear and check if all values are cleared', async function(browser) {
    browser
      .sendKeys('input[name=to]', 'hello')
      .clearValue('input[name=to]')
      .sendKeys('input[name=to]', 'hi')
      .pause(3000)
      .assert
      .valueEquals('input[name=to]', 'hi');
  });

  after(browser => browser.end());
});
