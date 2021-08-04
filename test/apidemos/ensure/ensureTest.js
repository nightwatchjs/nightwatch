
module.exports = {
  after(browser) {
    browser.end();
  },
  'Browser Context': function (browser) {
    browser.url('http://localhost')
      .ensure.elementIsSelected('#weblogin');
    
  }
 
};
