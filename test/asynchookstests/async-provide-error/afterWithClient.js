module.exports = {
  demoTest : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  },

  after : function(client, done) {
    client.end(function() {
      done(new Error('Provided error afterWithClient'));
    });
  }
};
