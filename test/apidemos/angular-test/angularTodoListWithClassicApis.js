describe('angularjs homepage todo list - with classic apis', function() {

  it('should add a todo using global element()', function(browser) {
    // adding a new task to the list
    browser
      .navigateTo('https://angularjs.org')
      .sendKeys('[ng-model="todoList.todoText"]', 'what is nightwatch?')
      .click('[value="add"]')

      // verifying if there are 3 tasks in the list
      .expect.elements('[ng-repeat="todo in todoList.todos"]').count.toEqual(3)

      // verifying if the third task if the one we have just added
      .expect.element({
        selector: '[ng-repeat="todo in todoList.todos"]',
        index: 2
      }).text.toEqual('what is nightwatch?')

      // find our task in the list and mark it as done
      .findElement({
        selector: '[ng-repeat="todo in todoList.todos"] input',
        index: 2
      }, function(inputResult) {
        const inputElement = inputResult.value;
        browser.click(inputElement);
      })
      // verify if there are 2 tasks which are marked as done in the list
      .expect.elements('*[module=todoApp] li .done-true').count.to.equal(2);
  });

});