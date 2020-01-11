describe('basic describe test', function () {

  this.desiredCapabilities = {
    name: 'basicDescribe'
  };

  test('demoTest', function (client) {
    client.assert.strictEqual(client.options.desiredCapabilities.name, 'basicDescribe');

    client.url('http://localhost')
      .assert.elementPresent('#weblogin');
  });

  after(function (client) {
    client.end();
  });
});

