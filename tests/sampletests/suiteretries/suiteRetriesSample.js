var failFirstTime = true;

module.exports = {
  before: function (client) {
    client.url('http://localhost')
  },

  after: function (client) {
    client.end();
  },

  demoStep1 : function (client) {
    client
      .assert.elementPresent('#weblogin')
      .perform(function() {
        client.globals.test.ok('demoStep1 called.');
      });

  },

  demoStep2 : function (client) {
    client
      .elements('css selector', '#weblogin', function() {
        if (failFirstTime) {
          failFirstTime = false;
          client.assert.ok(false);
        }

        client
          .assert.elementPresent('#weblogin')
          .perform(function() {
            client.globals.test.ok('demoStep2 called.');
          });
      });
  }

};
