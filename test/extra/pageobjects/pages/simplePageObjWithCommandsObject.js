const commonCommands = {
  dropdownSelect() {
    return this;
  },

  dropdownSelectByText() {
    return this;
  },

  scrollToElement() {
    return this;
  }
};

const testCommands = {
  ...commonCommands,

  testCommand() {
    return this;
  }
};

const o = {
  url: 'http://localhost.com',
  elements: {
    loginAsString: '#weblogin',
    loginCss: {selector: '#weblogin'},
    loginIndexed: {selector: '#weblogin', index: 1},
    loginXpath: {selector: '//weblogin', locateStrategy: 'xpath'},
    loginId: {selector: 'weblogin', locateStrategy: 'id'}
  },
  commands: testCommands
};

module.exports = o;