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

  it('Demo test ecosia.org on findElement and get aliases', function(browser) {
    browser
      .waitForElementVisible('body')
      .element('.main-nav').findElement('.button')
      .assert.visible('.button__text');

    const span = browser
      .waitForElementVisible('body')
      .element('.main-nav').get('.button')
      .assert.visible('.button__text');
  });

  it('Demo test ecosia.org on findElements and getAll aliases', async function(browser) {
    browser
      .waitForElementVisible('body')
      .element('.indexpage').findElements('.section-wrapper')[0];
  });

  after(browser => browser.end());
});
