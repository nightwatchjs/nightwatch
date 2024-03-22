module.exports = {
  '@desiredCapabilities': {
    name: 'test-Name'
  },
  demoTest: function (client) {
    client.assert.equal(client.options.desiredCapabilities.name, 'test-Name');

    client.url('http://localhost')
      .assert.elementPresent('#weblogin');
  },

  after: function (client) {
    client.end();
  }
};
