module.exports = {
  demoTest : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  },

  after : function(client, done) {
    done(new Error('Provided error after'));
  }
};
