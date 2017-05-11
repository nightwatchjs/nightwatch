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
    loginIndexed: { selector: '#weblogin', index: 1 },
    loginXpath: { selector: '//weblogin', locateStrategy: 'xpath' },
    loginId: { selector: 'weblogin', locateStrategy: 'id' },
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
        getStarted: {
          selector: '#getStarted',
          elements: {
            start: { selector: '#getStartedStart' }
          }
        }
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
    },
    dynamicNoArgs: {
      selector: function () { return '#signupSection'; },
      elements: { foo: '#helpBtn' }
    },
    dynamicSingleArg: {
      selector: function (arg1) { return '' + arg1; },
      elements: { bar: '#helpBtn' }
    },
    dynamicMultiArgs: {
      selector: function (arg1, arg2) { return arg1 + arg2; },
      elements: { foobar: '#helpBtn' }
    },
    dynamicMultiArgsDynamicElement: {
      selector: function (arg1, arg2) { return arg1 + arg2; },
      elements: { dynamicSingleArg: function (arg1) { return '' + arg1; } }
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
