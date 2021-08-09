module.exports = {
  after(browser) {
    browser.end();
  },
  'Firefox API basic test': function (browser) {
    browser.firefox.installAddon('path/to/xpi');
  }
};
