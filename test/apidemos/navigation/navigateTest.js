const assert = require('assert');

describe('navigate test', function() {

  after(browser => {
    assert.strictEqual(browser.globals.calls, 5);

    browser.customQuit(result => {
      browser.globals.calls++;
      assert.strictEqual(result.client.sessionId, null);
    }, function() {
      browser.globals.calls++;
    });
  });

  it('navigateTo', function (browser) {
    browser.navigateTo('http://localhost').perform(function() {
      this.globals.calls++;
    });
  });

  it('navigateTo async', async function (browser) {
    const result = await browser.navigateTo('http://localhost', function() {
      browser.globals.calls++;

      return {status: 'success'};
    });

    assert.deepStrictEqual(result, {status: 'success'});

    const url = await browser.getCurrentUrl();
    assert.strictEqual(url, 'http://localhost');

    const urlWithCallback = await browser.getCurrentUrl(function(result) {
      browser.globals.calls++;

      return result.value;
    });
    assert.strictEqual(urlWithCallback, 'http://localhost');
  });

});
