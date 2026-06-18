describe('stale element reference error', function() {

  it('should add selector and error line for stale element reference error', function() {
    const deletedElement = element(by.id('deleted'));
    const deleteElement = element(by.id('delete'));
    browser
      .navigateTo('https://www.selenium.dev/selenium/web/javascriptPage.html')
      .click(deletedElement);

    browser.click(deleteElement);

    browser.click(deletedElement);
  });

  after(browser => browser.end());
});
