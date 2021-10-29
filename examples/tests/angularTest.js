describe('angularjs homepage todo list', function() {

  // using the new element() global utility in nightwatch@2 to init elements
  const todoElement = element('[ng-model="todoList.todoText"]');
  const addButtonEl = element('[value="add"]');
  
  it('should add a todo', function() {
    browser.navigateTo('https://angularjs.org');
    
    todoElement.sendKeys('what is nightwatch?');
    addButtonEl.click();
    
    browser.expect.elements('[ng-repeat="todo in todoList.todos"]').count.to.equal(3);
    browser.expect.element({selector: '[ng-repeat="todo in todoList.todos"]', index: 2}).text.to.equal('what is nightwatch?');
    
    browser.findElement({selector: '[ng-repeat="todo in todoList.todos"]', index: 2}, function(todo) {
      browser.elementIdElement(todo.value.getId(), 'css selector', 'input', function(input) {
        browser.elementIdClick(input.elementId);
      });
    });
    
    browser.expect.elements('.done-true').count.to.equal(2);
  });
});
