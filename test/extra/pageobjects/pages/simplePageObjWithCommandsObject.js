module.exports = {
  url: 'http://localhost.com',
  elements: {
    loginAsString: '#weblogin',
    loginCss: {selector: '#weblogin'},
    loginIndexed: {
      selector: '#weblogin',
      index: 1
    },
    loginXpath: {
      selector: '//weblogin',
      locateStrategy: 'xpath'
    },
    loginId: {
      selector: 'weblogin',
      locateStrategy: 'id'
    }
  },
  commands: {
    dropdownSelect() {
      return this;
    },

    dropdownSelectByText() {
      return this;
    },

    scrollToElement() {
      return this;
    },

    testCommand() {
      return this;
    }
  }
};
