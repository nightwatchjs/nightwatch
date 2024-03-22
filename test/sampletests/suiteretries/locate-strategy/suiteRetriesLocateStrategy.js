var failFirstTime = true;

module.exports = {
  before(client) {
    client.url('http://localhost');
  },

  after(client) {
    client.end();
  },

  demoStep1(client) {
    client
      .assert.elementPresent('#weblogin')
      .elements('css selector', '#weblogin', function() {
        if (failFirstTime) {
          client.useXpath();
        }
      })
      .perform(function() {
        if (failFirstTime) {
          failFirstTime = false;

          return client.assert.ok(false);
        }
      });
  }

};
