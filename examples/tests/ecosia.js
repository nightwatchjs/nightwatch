describe('Ecosia.org Demo', function() {

  before(browser => {
    browser
      .navigateTo('https://www.ecosia.org/');
  });

  it('Demo test ecosia.org', function(browser) {
    browser
      .navigateTo('https://www.ecosia.org/')
      .moveTo()

    browser
    .navigateTo('https://www.google.com/')
    .moveTo()
});

it('Demo test ecosia.org - 2', function(browser) {
  browser
    .navigateTo('https://www.ecosia.org/')
    .moveTo()

  browser
  .navigateTo('https://www.google.com/')
  .moveTo()
});

  after(browser => browser.end());
});
