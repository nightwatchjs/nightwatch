describe('ensureTestSelected', function() {
  after(browser => {
    browser.end();
  });

  it('ensure elementIsSelected', function (browser) {
    browser
      .url('http://localhost')
      .ensure.elementIsSelected('#weblogin');
  });

  it('ensure elementsLocated', async function (browser) {
    await browser
      .url('http://localhost')
      .ensure.elementsLocated({
        selector: '#weblogin',
        timeout: 100
      });
  });
});
