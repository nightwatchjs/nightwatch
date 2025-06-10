module.exports = {
  'scroll to top': function(browser) {
    browser
      .url('http://localhost:10195')
      .scrollToTop()
      .end();
  }
}; 