describe('sample test with element error', function () {

  test('demoTest', (client) => {
    client
      .url('http://localhost')
      .click('#element-error')
      .waitForElementPresent('#weblogin');
  });

  after(client => client.end());
});

