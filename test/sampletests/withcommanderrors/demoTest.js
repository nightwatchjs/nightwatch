module.exports = {
  'Demo test': function (browser) {
    browser
      .url('http://localhost')
      .waitForElementPresent('#weblogin')
      .pause(100)
      .frameParent()
      .end();
  }
};
