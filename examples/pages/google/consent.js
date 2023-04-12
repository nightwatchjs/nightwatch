class ConsentCommand {
  turnOffSearchCustomization() {
    this.page.section.customizeSearch.click('@turnOffButton');

    return this;
  }

  turnOffYoutubeHistory() {
    this.page.section.youtubeHistory.click('@turnOffButton');

    return this;
  }

  turnOffAdPersonalization() {
    this.page.section.adPersonalization.click('@turnOffButton');

    return this;
  }

  confirm() {
    this.page.section.consentForm.click('@submitButton');

    return this;
  }

  turnOffEverything() {
    return this.turnOffSearchCustomization()
      .turnOffYoutubeHistory()
      .turnOffAdPersonalization()
      .confirm();
  }
}

const createSectionFor = (text) => {
  return Object.assign({
    selector: `//div[contains(.,"${text}")]`,
    locateStrategy: 'xpath'
  }, {
    elements: {
      turnOffButton: 'button[aria-label^="Turn off"]'
    }
  });
};

module.exports = {
  url: 'http://google.com',
  commands: ConsentCommand,

  elements: {
    consentModal: 'form[action^="https://consent.google"]'
  },

  sections: {
    customizeSearch: createSectionFor('Search customization'),
    youtubeHistory: createSectionFor('YouTube History'),
    adPersonalization: createSectionFor('Ad personalization'),

    consentForm: {
      selector: 'form[action^="https://consent.google"]',
      elements: {
        submitButton: 'button'
      }
    }
  }
};
