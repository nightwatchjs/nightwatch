module.exports = {
  desiredCapabilities : {
    name : 'test-Name'
  },
  demoTest : function (client) {
    client.globals.test.equals(client.options.desiredCapabilities.name, 'test-Name');

    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  }
};
