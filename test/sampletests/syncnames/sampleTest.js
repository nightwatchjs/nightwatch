var assert = require('assert');
module.exports = {
  demoTest: function (client) {
    assert.equal(client.options.desiredCapabilities.name, 'Sample Test');
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  }
};
