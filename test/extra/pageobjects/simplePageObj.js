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
    loginXpath: { selector: '//weblogin', locateStrategy: 'xpath' },
    loginDynamicNoArgsInline: function(){return '#weblogin';},
    loginDynamicSingleArgInline: function(element){return '' + element;},
    loginDynamicMultiArgsInline: function(arg1, arg2){return arg1 + arg2;},
    loginDynamicArgsCss: {selector: function(element){return '' + element;}},
    loginDynamicArgsXpath: {selector: function(element){return '' + element;}, locateStrategy:'xpath'}
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
