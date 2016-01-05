var searchCommands = {
  submit: function() {
    this.waitForElementVisible('@submitButton', 3000)
      .click('@submitButton')
      .api.pause(1000);
    return this; // Return page object for chaining
  }
};

module.exports = {
  url: 'http://google.com',
  commands: [searchCommands],
  elements: {
    searchBar: { selector: 'input[name=q]' },
    submitButton: { selector: 'button[type=submit]' }
  }
};
