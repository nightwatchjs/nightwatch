describe('google search with consent form - page objects', function() {

  this.disabled = this.argv.env !== 'chrome';

  const homePage = browser.page.google.search();
  const consentPage = browser.page.google.consent();

  before(async () => homePage.navigate());

  after(async (browser) => browser.quit());

  it.only('should complete the consent form', async function (browser) {
    const consentPresent = await homePage.isPresent('@consentModal');

    if (consentPresent) {
      await homePage.expect.section('@consentModal').to.be.visible;

      const {consentModal} = homePage.section;
      await consentModal.click('@rejectAllButton');
    }
  });

  it('should find nightwatch.js in results', function (browser) {
    homePage.setValue('@searchBar', 'Nightwatch.js');
    homePage.submit();

    const resultsPage = browser.page.google.searchResults();
    resultsPage.expect.element('@results').to.be.present;

    resultsPage.expect.element('@results').text.to.contain('Nightwatch.js');

    resultsPage.expect.section('@menu').to.be.visible;

    const menuSection = resultsPage.section.menu;
    menuSection.expect.element('@all').to.be.visible;
  });
});
