module.exports = {
  'test case': (browser) => {
    const homepage = browser.page.homepage();
    homepage.open();
    homepage.selectValueTen();
  }
};