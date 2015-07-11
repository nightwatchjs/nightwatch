
describe('Demo test with Mocha', function() {

  describe('for testing purposes', function() {

    before(function(client, done) {
      client.globals.test.ok('beforeEach callback called.');
      done();
    });

    after(function(client, done) {
      setTimeout(function() {
        client.globals.test.ok('after callback called.');
        done();
      }, 100);
    });

    afterEach(function(client, done) {
      setTimeout(function() {
        client.globals.test.ok('afterEach callback called.');
        done();
      }, 100);
    });

    beforeEach(function(client, done) {
      setTimeout(function() {
        client.globals.test.ok('before callback called.');
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