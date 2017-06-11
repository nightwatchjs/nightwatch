module.exports = {
  demoTest : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  },

  beforeEach : function(client, done) {
    client.perform(function() {
      setTimeout(function() {
        done(new Error('Provided error beforeEachAsyncWithClient'));
      }, 10);
    });
  }
};
