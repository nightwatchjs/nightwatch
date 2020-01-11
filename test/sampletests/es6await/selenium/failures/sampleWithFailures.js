const assert = require('assert');

module.exports = {

  asyncGetCookiesTest: async function (client) {
    await client.url('http://localhost');

    const cookies = await client.getCookies();
    assert.strictEqual(cookies.value[0].name, 'test_cookie');

    client.end();
  },

  demoTest2 : async function (client) {
    await client.url('http://localhost');

    client.assert.elementPresent('#weblogin');
    await client.assert.elementPresent({
      selector: '#badElement',
      timeout: 15,
      retryInterval: 15
    });

    client.end();
  }
};
