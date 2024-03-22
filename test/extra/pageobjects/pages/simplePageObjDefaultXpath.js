module.exports = {
  url: 'http://localhost.com',
  elements: {
    xpathElement: '//div',
    xpathElement2: {selector: '//div[@class="example"]'},
    cssSelectorElement: {
      selector: '#weblogin',
      locateStrategy: 'css selector'
    }
  },
  sections: {
    signUp: {
      selector: '//div',
      elements: {
        start: {
          selector: '#getStartedStart',
          locateStrategy: 'css selector'
        }
      }
    }
  },
  commands: []
};
