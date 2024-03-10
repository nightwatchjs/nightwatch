describe('Ecosia.org Demo', function() {

  before(browser => {
    browser
      .navigateTo('https://www.ecosia.org/');
  });

  it('Demo test ecosia.org', function(browser) {
    browser
      .waitForElementVisible('body')
      .assert.titleContains('Ecosia')
      .assert.visible('input[type=search]')
      .setValue('input[type=search]', 'nightwatch')
      .assert.visible('button[type=submit]')
      .click('button[type=submit]')
      .assert.textContains('.layout__content', 'Nightwatch.js');
  });

  describe('isPresent Demo', function() {
    it('test isPresent', async function(browser) {
      const result = await browser.element('input[name=q]').isPresent();
      browser.assert.equal(result, true);
    });
  });

  after(browser => browser.end());
});
