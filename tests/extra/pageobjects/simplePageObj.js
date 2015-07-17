var testCommands = {
  testCommand : function() {
    return this;
  }
};

module.exports = {
  url: 'http://localhost.com',
  elements: {
    loginAsString: '#weblogin',
    loginCss: { selector: '#weblogin' },
    loginXpath: { selector: '//weblogin', locateStrategy: 'xpath' }
  },
  sections: {
    signUp: {
      selector: '#signupSection',
      sections: {
        getStarted: { selector: '#getStarted' }
      },
      elements: {
        help: { selector: '#helpBtn' }
      }
    }
  },
  commands: [testCommands]
};
