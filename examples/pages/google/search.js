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

  sections: {
    consentModal: {
      selector: '[aria-modal="true"][title="Before you continue to Google Search"]',
      elements: {
        customizeButton: 'div.VDity button:nth-child(1)'
      }
    }
  },

  elements: {
    searchBar: {
      selector: 'input[name=q]'
    },

    submitButton: {
      selector: 'input[value="Google Search"]'
    }
  }
};
