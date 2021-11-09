describe('angularjs homepage todo list - with element global', function() {

  // using the new element() global utility in Nightwatch 2 to init elements
  // before tests and use them later
  const todoElement = element('[ng-model="todoList.todoText"]');
  const addButtonEl = element('[value="add"]');

  it('should add a todo using global element()', function() {
    ///////////////////////////////////////////////////
    // browser can now also be accessed as a global   |
    ///////////////////////////////////////////////////

    // adding a new task to the list
    browser
      .navigateTo('http://localhost')
      .sendKeys(todoElement, 'what is nightwatch?')
      .click(addButtonEl);

    ///////////////////////////////////////////////////
    // global expect is equivalent to browser.expect  |
    ///////////////////////////////////////////////////

    // verifying if there are 3 tasks in the list
    expect.elements('[ng-repeat="todo in todoList.todos"]').count.to.equal(3);

    // verifying if the third task if the one we have just added
    const lastElementTask = element({
      selector: '[ng-repeat="todo in todoList.todos"]',
      index: 2
    });

    expect(lastElementTask).text.to.equal('what is nightwatch?');

    // find our task in the list and mark it as done
    lastElementTask.findElement('input', function(inputResult) {
      if (inputResult.error) {
        throw inputResult.error;
      }

      const inputElement = element(inputResult.value);
      browser.click(inputElement);
    });

    // verify if there are 2 tasks which are marked as done in the list
    expect.elements('*[module=todoApp] li .done-true').count.to.equal(2);
  });

});