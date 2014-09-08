module.exports = {
  desiredCapabilities : {
    name : 'test-Name'
  },
  demoTest : function (client) {
    client.globals.test.equals(client.options.desiredCapabilities.name, 'test-Name');

    client.url('http://localhost')
      .assert.elementPresent('#weblogin');

  },
  after : function(client) {
    client.end(function() {
      client.globals.test.ok('END called');
    });
  }
};
