module.exports = {
  'Scroll Commands Example': function(browser) {
    // Example 1: Basic scrolling to coordinates
    browser
      .url('https://example.com')
      .scrollTo(0, 500) // Scroll 500 pixels down
      .pause(1000);

    // Example 2: Scroll to element
    browser
      .scrollIntoView('#some-element') // Scroll until element is visible
      .pause(1000);

    // Example 3: Scroll to bottom of page
    browser
      .scrollToBottom() // Scroll to the very bottom
      .pause(1000);

    // Example 4: Scroll to top of page
    browser
      .scrollToTop() // Scroll back to the top
      .pause(1000);

    // Example 5: Smooth scrolling with options
    browser
      .scrollTo({
        left: 0,
        top: 1000,
        behavior: 'smooth' // Smooth scrolling animation
      })
      .pause(1000);

    // Example 6: Scroll element into view with options
    browser
      .scrollIntoView('#another-element', {
        behavior: 'smooth',
        block: 'center', // Center the element vertically
        inline: 'nearest' // Align horizontally as close as possible
      })
      .pause(1000);

    // Example 7: Using scroll commands in a real-world scenario
    browser
      .url('https://example.com/long-page')
      .waitForElementVisible('body')
      .scrollToBottom() // First scroll to bottom
      .assert.visible('#footer-element') // Verify footer is visible
      .scrollToTop() // Scroll back to top
      .assert.visible('#header-element') // Verify header is visible
      .scrollIntoView('#important-content') // Scroll to important content
      .assert.visible('#important-content') // Verify it's visible
      .end();
  },

  'Scroll Commands in Page Objects': function(browser) {
    // Example of using scroll commands in page objects
    const loginPage = browser.page.loginPage();

    loginPage
      .navigate()
      .scrollToBottom() // Scroll to see footer links
      .click('@forgotPasswordLink')
      .scrollToTop() // Scroll back to top for login form
      .setValue('@usernameInput', 'testuser')
      .setValue('@passwordInput', 'password123')
      .scrollIntoView('@loginButton') // Ensure login button is visible
      .click('@loginButton')
      .end();
  },

  'Scroll Commands with Custom Commands': function(browser) {
    // Example of creating custom scroll commands
    browser
      .url('https://example.com')
      .scrollToMiddle() // Custom command to scroll to middle of page
      .scrollToElement('#target-element') // Custom command to scroll to specific element
      .scrollBy(0, 200) // Custom command to scroll by specific amount
      .end();
  }
};
