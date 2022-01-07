describe('angularjs homepage todo list - with element global and stale element error', function() {

  // using the new element() global utility in Nightwatch 2 to init elements
  // before tests and use them later
  const todoElement = element('[ng-model="todoList.todoText"]');

  it('should send keys to element', function() {
    browser.sendKeys(todoElement, 'what is nightwatch?');
  });

  it('should send keys to element again with stale element error', async function(browser) {
    await browser.sendKeys(todoElement, 'what is nightwatch?');
  });
});