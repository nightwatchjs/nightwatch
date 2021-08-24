describe('angularjs homepage todo list', function(){
  it('should add a todo', function(){
    browser.url('https://angularjs.org');
    element('[ng-model="todoList.todoText"]').sendKeys('write first protractor test');
    element('[value="add"]').click();
    browser.expect.elements('[ng-repeat="todo in todoList.todos"]').count.to.equal(3);
    browser.expect.element({selector: '[ng-repeat="todo in todoList.todos"]', index: 2}).text.to.equal('write first protractor test');
    

    //Task completed: mark it as done
    browser.findElement({selector: '[ng-repeat="todo in todoList.todos"]', index: 2}, function(todo){
      browser.elementIdElement(todo.value.getId(), 'css selector', 'input', function(input){
        browser.elementIdClick(input.elementId);
      });
    });
    browser.expect.elements('.done-true').count.to.equal(2);
  });
});