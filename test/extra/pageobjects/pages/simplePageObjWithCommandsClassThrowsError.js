const CommonCommands = require('../commands/commandsClassWithName.js');

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

  commands: CommonCommands
};
