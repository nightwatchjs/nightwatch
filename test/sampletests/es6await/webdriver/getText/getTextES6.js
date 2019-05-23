const assert = require('assert');

module.exports = {
  'getText() test with ES6 async/await': async (client) => {
    client.url('http://localhost');

    const textResult = await client.getText('#element-selector');
    assert.ok(!!textResult);
    assert.ok('value' in textResult);
    assert.strictEqual(textResult.value, 'sample text value');
  }
};
