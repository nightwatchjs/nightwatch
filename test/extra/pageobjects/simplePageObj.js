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
    },
    propTest: {
        selector: '#propTest',
        props: function(){
            var defaults = {};
            defaults[ this.name ] = this.selector + ' Value';
            return {
                defaults: defaults
            };
        }
    }
  },
  commands: [testCommands],
  props: function(){
    return {
        prop: 'example',
        url: this.url
    };
  }
};
