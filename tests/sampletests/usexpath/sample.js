module.exports = {
  demoTestXpath : function (client) {
    client
      .url('http://localhost')
      .useXpath()
      .waitForElementPresent('//weblogin', 50, function(result) {
        client.globals.test.equals(result.status, 0);
        client.globals.test.deepEqual(result.value, { ELEMENT: '0' });
      })
      .useCss()
      .end();
  },

  after : function(client, callback) {
    process.nextTick(function() {
      client.end();
      client.globals.test.ok('after callback called');
      callback();
    });
  }
};
