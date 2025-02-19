/**
 * A Nightwatch page object. The page object name is the filename.
 *
 * Usage:
 *   browser.page.google.search()
 *
 * See the example test using this object:
 *   specs/with-page-objects/google.js
 *
 * For more information on working with page objects, see:
 *   https://nightwatchjs.org/guide/concepts/page-object-model.html
 *
 */

const searchCommands = {
  submit() {
    this.waitForElementVisible('@submitButton', 1000)
      .click('@submitButton');

    this.pause(1000);

    return this; // for command-chaining
  }
};

module.exports = {
  url: 'https://google.no',

  commands: [
    searchCommands
  ],

  elements: {
    searchBar: {
      selector: 'textarea[name=q]'
    },

    submitButton: {
      selector: 'input[value="Google Search"]'
    }
  }
};
