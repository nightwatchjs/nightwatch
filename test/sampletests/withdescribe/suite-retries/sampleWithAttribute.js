describe('sample with suiteRetries', function() {
  this.suiteRetries(1);

  before(function(client, callback) {
    client.globals.calls++;
    callback();
  });

  beforeEach(function(client, callback) {
    client.globals.calls++;
    callback();
  });

  test('demoTest', function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .assert.elementPresent('#webLogin')
      .end();
  });

  test('demoTest2', function (client) {
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
