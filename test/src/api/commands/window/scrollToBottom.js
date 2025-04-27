module.exports = {
  'scroll to bottom': function(browser) {
    browser
      .url('http://localhost:10195')
      .scrollToBottom()
      .end();
  }
}; 