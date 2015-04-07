/**
 * Sample automated test scenario for Nightwatch.js using page objects
 *
 */

module.exports = {
  'Simple demo IMDB test using page objects' : function(client) {
    var homePage = client.page.imdbHome();
    homePage.goTo()
      .click('browseMoreTrailers')
      .assert.title('IMDb Trailer Gallery')

    client.end();
  },

  'Demo IMDB test using sections' : function(client) {
    var homePage = client.page.imdbHome();
    homePage.goTo();

    var newsSection = homePage.section.news;
    newsSection.click('moviesFilter')
      .assert.elementPresent('newsHeader')
      .click('tvFilter')
      .assert.elementPresent('newsHeader');

    client.end();
  },

  'Demo IMDB test using sections and shared elements' : function(client) {
    var homePage = client.page.imdbHome();
    homePage.goTo()
      .setValue('search', 'nightwatch')
      .click('submit');

    var searchResults = client.page.imdbSearchResults();

    var titleResults = searchResults.section.titles;
    titleResults.waitForElementPresent('results')
      .assert.containsText('results', 'Nightwatch')
      .assert.elementPresent('photo');

    var keywordResults = searchResults.section.keywords;
    keywordResults.waitForElementPresent('results')
      .assert.containsText('results', 'Nightwatch')
      .assert.elementPresent('photo');

    client.end();
 }
};
