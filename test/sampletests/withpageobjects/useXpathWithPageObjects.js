module.exports = {
  before(c) {
    c.useXpath();
  },

  'waitFor element visible after xpath': (client) => {
    client.url('http://localhost');

    const page = client.page.simplePageObj();
    page.waitForElementPresent('@loginAsString', 10);

  }
};
