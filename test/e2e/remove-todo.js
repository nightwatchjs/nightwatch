describe('Remove todo item', ()=> {
  before((browser)=> {
    browser.navigateTo('http://localhost:3000');
  });
  
  it('should be able to remove task', async ()=> {
  
    await browser.waitForElementVisible('body')
      .assert.titleEquals('Vue.js ToDo App')
      .assert.elementsCount('button.btn__danger', 4)
    
    const deleteBtns = await browser.findElement('button.btn__danger');

    await browser.click(deleteBtns[0])
      .assert.elementsCount('ul.stack-large > li', 4);
  });
  
  after((browser)=> {
    browser.end();
  });
});