module.exports = {
  'Test with browser.myPause' : function (browser) {
    browser
      .url('http://www.google.com', function() {
        browser.myPause(500, function () {
          browser.waitForElementVisible('body', 1000);
        });
      })
      .end();
  }
};
