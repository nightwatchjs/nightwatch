describe('clearValue Demo', function () {
  before(browser => {
    browser
      .navigateTo('https://sandbox.mabl.com/mailbox');
  });

  it('shows issue with clearValue command', async function (browser) {
    browser
      .sendKeys('input[name=to]', 'hello')
      .clearValue('input[name=to]')
      .sendKeys('input[name=to]', 'hi')
      .pause(300000);
  });

  after(browser => browser.end());
});
