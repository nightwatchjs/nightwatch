module.exports = {
  demoTest : function (client) {
    client.url('http://localhost');
    client.expect.element('#weblogin').to.be.present;
    client.end();
  },

  demoTest2 : function (client) {
    client.url('http://localhost')
      .elements('css selector', '#weblogin', function(result) {
        var assertion = client.expect(result.value).to.have.length(1);
        client.globals.test.deepEqual(assertion.__flags.object, [{ ELEMENT: '0' }]);
        try {
          client.expect(result.value).to.have.length(2);
        } catch (ex) {
          client.globals.test.equals(ex.actual, 1);
          client.globals.test.equals(ex.expected, 2);
        }
      })
      .end();
  }
};
