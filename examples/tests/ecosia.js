describe('Ecosia.org Demo', function() {

  before(browser => {
    browser
      .url('https://www.ecosia.org/') // Use .url() instead of .navigateTo()
      .waitForElementVisible('body'); // Wait for the body element to become visible
  });

  it('Demo test ecosia.org', function(browser) {
    browser
      .expect.element('.wrong_selector').to.not.be.present; // Check if the element with class '.wrong_selector' is not present
  });

  after(browser => browser.end());
});
