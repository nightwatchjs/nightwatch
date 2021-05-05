describe('Angular Demo Example', () => {
  const todoInputField = 'input[ng-model="todoList.todoText"]';

  beforeEach((browser) => {
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
    browser.elements('css selector', 'li[ng-repeat="todo in todoList.todos"]', (elements) => {
      var allElements = elements.value;
      browser.elementIdText(allElements[2].ELEMENT, function (attribute) {
        browser.assert.ok(attribute.value === 'My first todo from Nightwatch');
        browser.elementIdClick(allElements[2].ELEMENT);
        browser.expect.elements('.done-true').count.to.equal(2);
      });
    });
  });

  test('should archive completed todo', (browser) => {
    browser.assert
      .visible(todoInputField)
      .setValue(todoInputField, 'My first todo from Nightwatch')
      .click('input[value="add"]');
    browser.elements('css selector', 'li[ng-repeat="todo in todoList.todos"]', (elements) => {
      elements.value.forEach((element) => {
        browser.elementIdElement(
          element.ELEMENT,
          'css selector',
          '.done-true',
          (selector) => {
            if (selector.status === -1) {
              browser.elementIdClick(element.ELEMENT);
            }
          },
          browser
        );
      });
      browser.expect.elements('.done-true').count.to.equal(3);
      browser.click('a[ng-click="todoList.archive()"]');
      browser.expect.elements('li[ng-repeat="todo in todoList.todos"]').count.to.equal(0);
    });
  });

  after((browser) => browser.end());
});
