const assert = require('assert');

describe('sampleWithFailures', function() {
  it('asyncGetCookiesTest', async function (client) {
    await client.url('http://localhost');

    const cookies = await client.getCookies();
    assert.strictEqual(cookies[0].name, 'test_cookie');

    client.end();
  });

  it('demoTest2', async function (client) {
    await client.url('http://localhost');

    client.assert.elementPresent('#weblogin');
    await client.assert.elementPresent({
      selector: '#badElement',
      timeout: 15,
      retryInterval: 15
    });

    client.end();
  });

  it('verify', async function (client) {
    await client.url('http://localhost');
    await client.verify.elementPresent({
      selector: '#badElement',
      timeout: 25,
      retryInterval: 15
    })
      .verify.elementPresent('#weblogin');

    client.end();
  });

  it('waitFor', async function(client) {
    await client.url('http://localhost');
    await client.waitForElementVisible({
      selector: '#badElement',
      timeout: 15,
      retryInterval: 15,
      abortOnFailure: false
    });

    client.end();
  });
});

