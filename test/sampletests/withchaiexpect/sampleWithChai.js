module.exports = {
  demoTest: function (client) {
    client.url('http://localhost');
    client.expect.element('#weblogin').to.be.present;
    client.end();
  },

  demoTest1: function (client) {
    client.url('http://localhost');

    expect(element('#weblogin')).to.be.present;

    client.end();
  },

  demoTest2: function (client) {
    client.url('http://localhost')
      .elements('css selector', '#weblogin', async function (result) {
        client.globals.test.ok(result.value);


        let assertion = client.expect(result.value).to.have.length(1);
        let value = await assertion.__flags.get('object');

        client.globals.test.deepEqual(value, [{ELEMENT: '0'}]);

        await client.expect(result.value).to.have.length(2);

      })
      .end();
  }
};
