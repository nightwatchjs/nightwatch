describe('Add todo item', ()=> {
  before((browser)=> {
    browser.navigateTo('http://localhost:3000');
  });

  it('should be able to add task', ()=> {

    browser.waitForElementVisible('body')
      .assert.titleEquals('Vue.js ToDo App')
      .assert.visible('input[type=text]')
      .setValue('input[type=text]', 'nightwatch')
      .assert.visible('button[type=submit]')
      .click('button[type=submit]')
      .assert.elementsCount('ul.stack-large > li', 5);
  });

  after((browser)=> {
    browser.end();
  });
});