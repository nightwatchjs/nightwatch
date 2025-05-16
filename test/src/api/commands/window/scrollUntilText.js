module.exports = {
  'scroll until text is visible': function(browser) {
    browser
      .url('http://localhost:10195')
      .scrollUntilText('Welcome to our site')
      .end();
  }
}; 