describe('sample test with skipTestcasesOnFail', function () {
  this.skipTestcasesOnFail = false;
  this.endSessionOnFail = false;
  this.timeout(10);
  this.retryInterval(5);

  this.tags = ['login'];

  let endFn;

  before(function (client, done) {
    endFn = client.end;
    done();
  });

  it('demoTest', function (client) {
    client.globals.calls++;

    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement');
  });

  it('demoTest2', function (client) {
    client.globals.calls++;

    client.end = function () {
      client.assert.fail('End should not be called.')
    };

    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement');
  });

  after(function (client, done) {
    client.end = endFn;
    done();
  });
});
