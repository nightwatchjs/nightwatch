describe('Mocha tests with failures', function() {

  before(function(client, callback) {
    client.globals.test_calls++;
    callback();
  });

  beforeEach(function(client, callback) {
    client.globals.test_calls++;
    callback();
  });

  it('demoTest', function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .end();
  });

  it('demoTest2', function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .end();
  });

  afterEach(function(client, callback) {
    client.globals.test_calls++;
    callback();
  });

  after(function(client, callback) {
    client.globals.test_calls++;
    callback();
  });
});
