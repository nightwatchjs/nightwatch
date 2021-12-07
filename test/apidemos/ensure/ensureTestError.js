module.exports = {
  after: function(browser) {
    browser.end();
  },

  'Ensure badElement test': async function (browser) {
    browser.url('http://localhost');
    const result = await browser.ensure.elementIsSelected('#badElement');
  }
};