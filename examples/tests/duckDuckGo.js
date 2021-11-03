describe('duckduckgo example', function() {

  it('Search Nightwatch.js and check results', function(browser) {
    browser
      .navigateTo('https://duckduckgo.com')
      .waitForElementVisible('#search_form_input_homepage')
      .sendKeys('#search_form_input_homepage', ['Nightwatch.js'])
      .click('#search_button_homepage')
      .assert.visible('.results--main')
      .assert.containsText('.results--main', 'Nightwatch.js');
  }); 
});
