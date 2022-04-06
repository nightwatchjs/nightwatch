describe('angularjs homepage todo list', function() {

  it('should add a todo using custom commands', async function(browser) {
    // adding a new task to the list
    const elements = await browser
      .navigateTo('https://angularjs.org')
      .sendKeys('[ng-model="todoList.todoText"]', 'what is nightwatch?')
      .click('[value="add"]')
      .angular.getElementsInList('todoList.todos');

    const taskEl = element(elements[2]);

    // verifying if the third task is the one we have just added
    // browser.assert.textEquals(taskEl, 'what is nightwatch?');

    await expect(taskEl).text.toEqual('what is nightwatch?');

    // find our task in the list and mark it as done
    const inputElement = await element(elements[2]).findElement('input');
    await browser.click(inputElement);

    // verify if there are 2 tasks which are marked as done in the list
    await expect.elements('*[module=todoApp] li .done-true').count.to.equal(2);
  });

});
