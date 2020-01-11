describe('sample test with failures and attribute', function() {
  this.retries(1);

  before(function(client, callback) {
    client.globals.calls++;
    callback();
  });

  beforeEach(function(client, callback) {
    client.globals.calls++;
    callback();
  });

  it('demoTest', function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .assert.elementPresent('#webLogin')
      .end();
  });

  it('demoTest2', function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .end();
  });

  afterEach(function(client, callback) {
    client.globals.calls++;
    callback();
  });

  after(function(client, callback) {
    client.globals.calls++;
    callback();
  });
});


