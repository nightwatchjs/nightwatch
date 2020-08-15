module.exports = {
  'Demo test' : function (browser) {
    browser
      .url('http://localhost')
      .waitForElementPresent('#weblogin')
      .openNewWindow('window')
      .pause(100)
      .end();
  }
};
