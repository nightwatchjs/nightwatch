describe('duck duck go basic tests', function(){

  const searchBar = element(by.css('#search_form_input_homepage'));
  const searchButton =  element(by.css('#search_button_homepage'));
  
  test('Search Nightwatch.js and check results', function(){

    browser.url('https://duckduckgo.com')
      .waitForElementVisible(searchBar)
      .waitForElementVisible(searchButton)
      .setValue(searchBar, ['Nightwatch.js', browser.keys.ENTER])
      .click(searchButton)
      .assert.visible('.results--main')
      .assert.containsText('.results--main', 'Nightwatch.js');
  }); 
});