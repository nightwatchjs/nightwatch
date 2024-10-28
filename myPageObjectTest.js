module.exports = {
  '@tags': ['myPageObject'], // Tag for easy filtering
  'Testing My Page Object URL': function (browser) {
    const myPageObject = browser.page.myPageObject();

    // Test when url is a string
    myPageObject.url = 'http://example.com';
    browser.url(myPageObject.url);

    browser.waitForElementVisible('body', 1000)
      .assert.urlEquals('http://example.com', 'URL is correct when set as a string');

    // Test when url is a function
    myPageObject.url = function () {
      return 'http://example.com';
    };
    browser.url(myPageObject.url());

    browser.waitForElementVisible('body', 1000)
      .assert.urlEquals('http://example.com', 'URL is correct when set as a function');

    browser.end();
  }
};
