module.exports = {
  url: 'http://imdb.com',
  elements: {
    search: { selector: '#navbar-query' },
    submit: { selector: '#navbar-submit-button' },
    browseMoreTrailers: { selector: '*//a[@href][contains(., "Browse more trailers")]' , locateStrategy: 'xpath'}
  },
  sections: {
    news: {
      selector: '.newsdesk',
      elements: {
        moviesFilter: { selector: 'a[href*="/news/movie"]' },
        tvFilter: { selector: 'a[href*="/news/tv"]' },
        newsHeader: { selector: '.news-header' }
      }
    }
  }
};