const assert = require('assert');

module.exports = {
  'getText() test with ES6 async/await': async (client) => {
    client.url('http://localhost');

    const page = client.page.simplePageObj();

    const textResult = await page.getText('#element-selector');
    assert.ok(!!textResult);
    assert.ok('value' in textResult);
    assert.strictEqual(textResult.value, 'sample text value');
  }
};
