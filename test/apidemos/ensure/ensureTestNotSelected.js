module.exports = {
  after(browser) {
    browser.end();
  },

  before() {
    browser.url('http://localhost');
  },

  'ensure .not.elementIsSelected': function (browser) {
    browser.ensure.not.elementIsSelected('#weblogin');
  }
};
