module.exports = {

  after: function(browser) {
    browser.end();
  },
  
  'Ensure badElement test': async (browser) => {
    await browser.url('http://localhost');
    
    await browser.waitForElementPresent('#weblogin',  100, true, async ()=> {
      await browser.waitForElementPresent('#badelement', 100, false, (result)=> {
        // eslint-disable-next-line no-console
        console.log('********result ************', result.status, result.value);
      });
    });
    const result = await browser.ensure.elementIsSelected('#weblogin');
  }
};