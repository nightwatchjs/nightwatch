describe('test with uncaught error', function () {

  this.tags = ['uncaught-error'];

  test('Passing test step', function (client) {
    client
      .url('http://localhost')
      .assert.elementPresent('#weblogin');
  });

  test('Uncaught error test step', function (client) {
    client.assert.elementPresent('#weblogin');

    setTimeout(function () {
      throw new Error('Test Error Uncaught');
    }, 100);
  });

});

