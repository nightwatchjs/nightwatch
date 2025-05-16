module.exports = {
  'AngularJS Website Tests': function(browser) {
    browser
      .url('https://angularjs.org')
      .waitForElementVisible('body')
      .pause(2000)

    // Test scrolling with different methods

      // Scroll to bottom and back to top
      .scrollToBottom()
      .pause(1000)
      .scrollToTop()
      .pause(1000)

      // Find and scroll to elements using different selectors
      .waitForElementPresent('#the-basics')
      .scrollIntoView({
        element: '#the-basics',  // Using ID selector
        behavior: 'smooth',
        block: 'center'
      })
      .pause(1000)
      .scrollToTop()
      .pause(1000)
      .scrollIntoView({
        element: '//*[contains(text(),"Super-powered")]',  // Using XPath with text
        behavior: 'smooth',
        block: 'center'
      })

      .end();
  }
};
