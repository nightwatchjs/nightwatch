xdescribe('sample test with failures', function() {
  it('demoTest', function (client) {
    client.globals.calls++;
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  });

  it('demoTest2', function (client) {
    client.globals.calls++;
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  });
});


