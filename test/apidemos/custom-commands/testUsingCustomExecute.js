const assert = require('assert');

describe('custom execute', function() {
  it('demo test', async function(browser) {
    await browser.pause(100)

    await browser.customExecuteAsync({prop: true}, function(endTime) {

    })

    await browser.pause(200)
  });
});
