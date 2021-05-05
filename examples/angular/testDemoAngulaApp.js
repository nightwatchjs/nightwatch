describe('Angular Demo Example', () => {
  const todoInputField = 'input[ng-model="todoList.todoText"]';

  before((browser) => {
    browser.url('https://angularjs.org/').waitForElementVisible('body');
  });

  test('should have a title', (browser) => {
    browser.assert.titleContains('AngularJS — Superheroic JavaScript MVW Framework');
  });

  test('should add a todo', (browser) => {
    browser.assert
      .visible(todoInputField)
      .setValue(todoInputField, 'My first todo from Nightwatch')
      .click('input[value="add"]');

    browser.expect.elements('li[ng-repeat="todo in todoList.todos"]').count.to.equal(3);
    browser.click('li[ng-repeat="todo in todoList.todos"]:nth-child(2');
    browser.expect.elements('.done-true').count.to.equal(2);
  });

  test('should archive completed todo', (browser) => {
    browser.refresh();
    browser.assert
      .visible(todoInputField)
      .setValue(todoInputField, 'My first todo from Nightwatch')
      .click('input[value="add"]');
    browser.elements('css selector', 'li[ng-repeat="todo in todoList.todos"]:not(:first-child)', (elements) => {
      elements.value.forEach((element) => {
        let key = Object.keys(element)[0];
        let elementID = element[key];
        browser.elementIdClick(elementID);
      });
      browser.expect.elements('.done-true').count.to.equal(3);
      browser.click('a[ng-click="todoList.archive()"]');
      browser.expect.elements('li[ng-repeat="todo in todoList.todos"]').count.to.equal(0);
    });
  });

  after((browser) => browser.end());
});
