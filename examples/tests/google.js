describe('sample google search', function() {
  this.tags = ['google'];

  it('demo test using expect apis', async function(browser) {
    await browser.navigateTo('http://google.no');

    const consentPresent = await browser.isPresent('[aria-modal="true"][title="Before you continue to Google Search"]');

    // Wait until we are on consent page
    if (consentPresent === true) {
      browser
        .waitForElementVisible('[aria-modal="true"][title="Before you continue to Google Search"]')
        .click('[aria-modal="true"] div.VDity button:nth-child(1)')

        // Wait until we are on consent page
        .expect.url().toContain('https://consent.google.no')

        // Turn everything off
        .click('button[aria-label="Turn off Search customization"]')
        .click('button[aria-label="Turn off YouTube History"]')
        .click('button[aria-label="Turn off Ad personalization"]')

        // click on confirm button
        .click('form[action^="https://consent.google.no"] button')

        // saving the consent form takes some time, no need to check for anything else
        .pause(1000);
    }

    await browser
      .waitForElementVisible('form[action="/search"] input[type=text]')
      .sendKeys('form[action="/search"] input[type=text]', ['Nightwatch.js', browser.Keys.ENTER])
      .assert.textContains('#rso>:first-child', 'Nightwatch.js')
      .end();
  });
});
