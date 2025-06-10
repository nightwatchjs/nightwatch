module.exports = {
  'scroll element into view': function(browser) {
    browser
      .url('http://localhost:10195')
      .scrollIntoView('#myElement')
      .end();
  }
}; 