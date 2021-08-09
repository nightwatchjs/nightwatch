module.exports = {
  after(browser) {
    browser.end();
  },
  'Chrome API basic test': function (browser) {
    browser.chrome.getNetworkConditions();
  }
};
