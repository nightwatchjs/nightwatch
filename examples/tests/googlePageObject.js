describe('google search with consent form - page objects', function() {
  const homePage = browser.page.google.search();

  before(async () => homePage.navigate());

  after(async (browser) => browser.quit());

  it('should find nightwatch.js in results', function (browser) {
    homePage.setValue('@searchBar', 'Nightwatch.js');
    homePage.submit();

    const resultsPage = browser.page.google.searchResults();
    resultsPage.expect.element('@results').to.be.present;

    resultsPage.expect.element('@results').text.to.contain('Nightwatch.js');

    resultsPage.expect.section('@menu').to.be.visible;

    const menuSection = resultsPage.section.menu;
    menuSection.expect.element('@videos').to.be.visible;
  });
});
