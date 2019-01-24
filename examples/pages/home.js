const searchCommands = {
  submit() {
    this.waitForElementVisible('@submitButton', 1000)
      .click('@submitButton')
      .api.pause(1000);

    return this; // Return page object for chaining
  },
  setPurposelyBroken() {
    this.setValue('@searchBarPurposelyBroken', "Purposely Broken");
    return this; // Return page object for chaining
  }
};

module.exports = {
  url: 'http://google.com',
  commands: [searchCommands],
  elements: {
    searchBar: {selector: 'input[name=q]'},
    searchBarPurposelyBroken: {selector: '#purposelyBroken'},
    submitButton: {selector: 'input[value="Google Search"]'}
  }
};
