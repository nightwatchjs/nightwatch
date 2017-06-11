module.exports = {
  demoTest : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  },

  beforeEach : function(client, done) {
    done(new Error('Provided error beforeEach'));
  }
};
