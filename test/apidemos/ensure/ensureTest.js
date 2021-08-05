
module.exports = {
  after(browser) {
    browser.end();
  },
  'Ensure basic test': function (browser) {
    browser.url('http://localhost')
      .ensure.elementIsSelected('#weblogin');
  }
 
};
