module.exports = {
  demoTest : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  },

  beforeEach : function(client, done) {
    setTimeout(function() {
      done(new Error('Provided error beforeEachAsync'));
    }, 10);
  }
};
