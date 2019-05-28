const assert = require('assert');

module.exports = {
  'basic test with ES6 async/await': async (client) => {
    client.url('http://localhost');

    const currentUrl = await client.url();
    assert.strictEqual(currentUrl.value, 'http://localhost');

    client.assert.elementPresent('#weblogin');

    await client.end();
  }
};
