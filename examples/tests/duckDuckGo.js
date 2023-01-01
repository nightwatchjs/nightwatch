describe('duckduckgo example', function() {

  this.tags = ['end-to-end'];

  it('Search Nightwatch.js and check results', function(browser) {
    browser
      .navigateTo('https://duckduckgo.com')
      .waitForElementVisible('#search_form_input_homepage')
      .sendKeys('#search_form_input_homepage', ['Nightwatch.js'])
      .click('#search_button_homepage')
      .assert.visible('.results--main')
      .assert.textContains('.results--main', 'Nightwatch.js');
  }); 
});
