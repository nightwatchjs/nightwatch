describe('basic describe test', function () {

  this.desiredCapabilities = {
    name: 'basicDescribe'
  };

  this.timeout(55);
  this.tags = ['something'];
  this.endSessionOnFail = false;
  this.skipTestcasesOnFail = false;

  test('demoTest one', function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin');
  });

  test.only('demoTest two', function (client) {
    client.assert.strictEqual(client.options.globals.waitForConditionTimeout, 55);
    client.assert.strictEqual(this.settings.desiredCapabilities.name, 'basicDescribe');

    client.url('http://localhost')
      .assert.elementPresent('#weblogin');
  });

  test('demoTest three', function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin');
  });
});

