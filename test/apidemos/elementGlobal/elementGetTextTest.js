const assert = require('assert');

describe('get text using element-global', function(){

  after(browser => browser.end());

  test('element.getText() command',  async (browser)=>{
    const weblogin = await element('#weblogin');
    const result = await weblogin.getText();
    assert.strictEqual(result.data, 'sample text');      
  });

});