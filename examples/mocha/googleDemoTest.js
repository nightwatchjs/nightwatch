describe('Google demo test for Mocha', function() {

  describe('for demo purposes', function() {

    before(function(client, done) {
      done();
    });

    after(function(client, done) {
      if (client.sessionId) {
        client.end(function() {
          done();
        });
      } else {
        done();
      }
    });

    afterEach(function(client, done) {
      done();
    });

    beforeEach(function(client, done) {
      done();
    });

    it('uses BDD to run the Google simple test', function(client) {
      client
        .url('http://google.com')
        .expect.element('body').to.be.present.before(1000);

      client.setValue('input[type=text]', ['nightwatch', client.Keys.ENTER])
        .pause(1000)
        .assert.containsText('#main', 'Night Watch');
    });

  });
});
