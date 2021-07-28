const assert = require('assert');

module.exports = {
  'getText() test with ES6 async/await': async (client) => {
    client.url('http://localhost');

    const page = client.page.simplePageObj();

    const result = await client.findElements('#element-selector');
    assert.ok(result.value[0]);
    assert.ok('element-6066-11e4-a52e-4f735466cecf' in result.value[0]);
    assert.strictEqual(result.value[0].getId(), '5cc459b8-36a8-3042-8b4a-258883ea642b');
    assert.strictEqual(result.value[0]['element-6066-11e4-a52e-4f735466cecf'], '5cc459b8-36a8-3042-8b4a-258883ea642b');

    const textResult = await page.getText('#element-selector');
    assert.ok(!!textResult);
    assert.ok('value' in textResult);
    assert.strictEqual(textResult.value, 'sample text value');

    const resultSection = await page.section.signUp.getText('@help');
    assert.strictEqual(resultSection.value, 'help text value');
  }
};
