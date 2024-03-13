const searchCommands = {
  submit() {
    this.waitForElementVisible('@submitButton', 1000)
      .click('@submitButton');

    this.pause(1000);

    return this; // Return page object for chaining
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
