var c = 0;
module.exports = {
  demoTest1 : function (client) {
    client.url('http://localhost');
  },

  demoTest2 : function (client) {
    client
      .assert.elementPresent('#weblogin')
      .end();
  },

  beforeEach : function(client, done) {
    c++;

    if (c == 1) {
      return done();
    }

    client.perform(function() {
      setTimeout(function() {
        done(new Error('Provided error beforeEachAsyncWithClientMultiple'));
      }, 10);
    });
  }
};
