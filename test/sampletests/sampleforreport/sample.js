module.exports = {
  '@desiredCapabilities': {
    name: 'test-Name'
  },
  demoTest: function (client) {
    client.assert.equal(client.options.desiredCapabilities.name, 'test-Name');

    client.url('http://localhost')
      .assert.elementPresent('#weblogin');
  },

  afterEach: function (client) {
    client.assert.equal(client.options.desiredCapabilities.name, 'test-Name');
  },

  after: function (client) {
    client.end();
  }
};
