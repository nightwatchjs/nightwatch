describe('passing test', function () {

  this.tags = ['uncaught-error'];

  test('demo Test Passing', function (client) {
    client
      .url('http://localhost')
      .assert.elementPresent('#weblogin')
      .waitForElementPresent('#weblogin');
  });

});

