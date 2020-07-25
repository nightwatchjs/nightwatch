module.exports = {
  demoTest(client) {
    client
      .url('http://localhost')
      .waitForElementPresent('#weblogin')
      .assert.not.elementPresent('#element-server-error')
  },

  demoTest2(client) {
    client
      .url('http://localhost')
      .waitForElementPresent('#weblogin')
      .waitForElementNotPresent('#element-server-error')
  },

  after(client) {
    client.end();
  }
};
