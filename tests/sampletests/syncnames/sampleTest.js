module.exports = {
  demoTest: function (client) {
    client.globals.test.equals(client.options.desiredCapabilities.name, 'Sample Test');
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  }
};
