describe('Demo test with Mocha', function() {

  describe('for testing purposes', function() {

    before(function(client, done) {
      client.globals.test_calls++;
      done();
    });

    after(function(client, done) {
      setTimeout(function() {
        client.globals.test_calls++;
        done();
      }, 100);
    });

    afterEach(function(client, done) {
      setTimeout(function() {
        client.globals.test_calls++;
        done();
      }, 100);
    });

    beforeEach(function(client, done) {
      setTimeout(function() {
        client.globals.test_calls++;
        done();
      }, 100);
    });

    it('demoTestAsyncOne', function(client) {
      client.url('http://localhost');
    });

    it('demoTestAsyncTwo', function(client) {
      client.end();
    });

  });
});