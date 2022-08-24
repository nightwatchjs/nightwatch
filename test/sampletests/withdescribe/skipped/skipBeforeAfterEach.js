describe('sample test with failures', function() {
  beforeEach(function (client) {
    client.globals.calls++;
  });

  it('demoTest', function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  });
  
  it('demoTest2', function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  });
  
  it.skip('demoTest3', function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  });
  
  xit('demoTest4', function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  });
  
  xtest('demoTest5', function (client) { // eslint-disable-line no-undef
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  });

  afterEach(function (client) {
    client.globals.calls++;
  });
});
  
  
  