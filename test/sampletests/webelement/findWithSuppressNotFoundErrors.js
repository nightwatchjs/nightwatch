describe('test', function () {
  test('test find with suppressNotFoundErrors', async (browser) => {
    browser.element.find({
      selector: browser.globals.selector,
      suppressNotFoundErrors: browser.globals.suppressNotFoundErrors
    });
  });
});
