describe('angularjs homepage todo list - with element global async', function() {

  // using the new element() global utility in Nightwatch 2 to init elements
  // before tests and use them later
  const todoElement = element('[ng-model="todoList.todoText"]');
  const addButtonEl = element('[value="add"]');

  it('should add a todo using global element()', async function() {
    await browser
      .navigateTo('https://angularjs.org')
      .sendKeys(todoElement, 'what is nightwatch?')
      .click(addButtonEl);

    await expect.elements('[ng-repeat="todo in todoList.todos"]').count.to.equal(3);

    const lastElementTask = element({
      selector: '[ng-repeat="todo in todoList.todos"]',
      index: 2
    });

    await expect(lastElementTask).text.to.equal('what is nightwatch?');

    // find our task in the list and mark it as done
    const inputElement = await lastElementTask.findElement('input');
    await browser.click(inputElement);

    // verify if there are 2 tasks which are marked as done in the list
    expect.elements('*[module=todoApp] li .done-true').count.to.equal(2);
  });

});