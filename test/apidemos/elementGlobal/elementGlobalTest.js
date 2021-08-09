const assert = require('assert');

describe('get text using element-global', function(){

  const signupSection = element(by.css('#signupSection'));

  after(browser => browser.end());

  test('element globals command',  async (browser)=>{
    const weblogin = element('#weblogin');
    const result = await weblogin.getText();
    assert.strictEqual(result, 'sample text');      
    const signupSectionId = await signupSection.getId();
    assert.strictEqual(signupSectionId, '0');
  });

});