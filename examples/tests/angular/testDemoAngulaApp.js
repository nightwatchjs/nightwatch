describe('Angular Demo Example', () => {
  const todoInputField = 'input[ng-model="todoList.todoText"]';

  before((browser) => {
    browser.url('https://angularjs.org/');
  });

  it('should have a title', (browser) => {
    browser.assert.titleContains('AngularJS — Superheroic JavaScript MVW Framework');
  });

  it('should add a todo', (browser) => {
    browser.assert
      .visible(todoInputField)
      .setValue(todoInputField, 'My first todo from Nightwatch')
      .click('input[value="add"]');

    browser.expect.elements('li[ng-repeat="todo in todoList.todos"]').count.to.equal(3);
    browser.click('li[ng-repeat="todo in todoList.todos"]:nth-child(2)');
    browser.expect.elements('.done-true').count.to.equal(2);
  });

  it('should archive completed todo', async (browser) => {
    await browser.refresh();

    await browser.assert.visible(todoInputField);

    await browser.setValue(todoInputField, 'My first todo from Nightwatch');
    await browser.click('input[value="add"]');

    const elements = await browser.elements('css selector', 'li[ng-repeat="todo in todoList.todos"]:not(:first-child)');

    await Promise.all(
      elements.value.map((element) => {
        let key = Object.keys(element)[0];
        let elementID = element[key];

        return browser.elementIdClick(elementID);
      })
    );

    browser.expect.elements('.done-true').count.to.equal(3);
    await browser.click('a[ng-click="todoList.archive()"]');
    browser.expect.elements('li[ng-repeat="todo in todoList.todos"]').count.to.equal(0);
  });

  after((browser) => browser.end());
});
