/**
 * This example is a slight modification of the example already available at:
 *   specs/basic/todoList.js
 *
 * This example demonstrate the use of custom-assertion defined at:
 *   custom-assertions/elementHasCount.js
 *
 * For more information on working with custom-assertions, see:
 *   https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-assertions.html
 *
 */

describe('To-Do List End-to-End Test', function() {
  it('should add a new todo element', async function() {
    // adding a new task to the list
    await browser
      .navigateTo('https://todo-vue3-vite.netlify.app/')
      .assert.elementHasCount('#todo-list ul li', 4) // use of custom-assertion
      .sendKeys('#new-todo-input', 'what is nightwatch?')
      .click('form button[type="submit"]')
      .assert.elementHasCount('#todo-list ul li', 5); // use of custom-assertion
  });
});
