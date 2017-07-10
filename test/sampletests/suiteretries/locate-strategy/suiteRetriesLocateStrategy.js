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
      .elements('css selector', '#weblogin', function() {
        if (failFirstTime) {
          client.useRecursion();
        }
      })
      .perform(function() {
        if (failFirstTime) {
          failFirstTime = false;
          client.assert.ok(false);
        }
      });
  }

};
