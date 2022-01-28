module.exports = {
  'Demo Google search test using page objects': async function (browser) {
    const homePage = browser.page.google.search();
    const consentPage = browser.page.google.consent();

    homePage.navigate();

    const consentPresent = await homePage.isPresent('[aria-modal="true"][title="Before you continue to Google Search"]');
    if (consentPresent) {
      homePage.expect.section('@consentModal').to.be.visible;

      const {consentModal} = homePage.section;
      consentModal.click('@customizeButton');

      browser.expect.url().toContain('https://consent.google.');
      consentPage.turnOffEverything();
    }

    homePage.setValue('@searchBar', 'Nightwatch.js');
    homePage.submit();

    const resultsPage = browser.page.google.searchResults();
    resultsPage.expect.element('@results').to.be.present;
    resultsPage.expect.element('@results').text.toContain('Nightwatch.js');
    resultsPage.expect.section('@menu').to.be.visible;

    const menuSection = resultsPage.section.menu;
    menuSection.expect.element('@all').to.be.visible;

    browser.quit();
  }
};
