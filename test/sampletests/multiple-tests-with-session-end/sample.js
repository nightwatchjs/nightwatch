module.exports = {
  '@desiredCapabilities': {
    name: 'test-Name'
  },

  demoTest1: function (client) {
    client.assert.equal(client.options.desiredCapabilities.name, 'test-Name');

    client.url('http://localhost')
      .assert.elementPresent('#webdriver')
      .end();
  },

  demoTest2: function (client) {
    client.assert.equal(client.options.desiredCapabilities.name, 'test-Name');

    client.url('http://localhost')
      .assert.elementPresent('#webdriver')
      .end();
  }
};
