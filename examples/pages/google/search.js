const searchCommands = {
  submit() {
    this.waitForElementVisible('@submitButton', 1000)
      .click('@submitButton');
    
    this.pause(1000);

    return this; // Return page object for chaining
  }
};

const consentModal = '[aria-modal="true"]';

module.exports = {
  url: 'https://google.no',
  commands: [
    searchCommands
  ],

  sections: {
    consentModal: {
      selector: consentModal,
      elements: {
        rejectAllButton: '.GzLjMd button:nth-child(1)'
      }
    }
  },

  elements: {
    consentModal,

    searchBar: {
      selector: 'input[name=q]'
    },

    submitButton: {
      selector: 'input[value="Google Search"]'
    }
  }
};
