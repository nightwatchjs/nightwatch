describe('test', function () {
  test('test find', async (browser) => {
    browser.globals.calls++;
    browser.element.find('#weblogin');
  });

  test('test find', async (browser) => {
    browser.globals.calls++;
    browser.element.find('#weblogin');
  });
});
