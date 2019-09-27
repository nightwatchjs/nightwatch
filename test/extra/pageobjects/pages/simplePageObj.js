const testCommands = {
  testCommand: function () {
    this.api.elements('css selector', '#weblogin', res => {
      this.clearValue('#weblogin');
      this.perform(function() {});
    });

    return this;
  }
};

module.exports = {
  url: 'http://localhost.com',
  elements: {
    loginAsString: '#weblogin',
    loginCss: {selector: '#weblogin'},
    loginIndexed: {selector: '#weblogin', index: 1},
    loginXpath: {selector: '//weblogin', locateStrategy: 'xpath'},
    loginId: {selector: 'weblogin', locateStrategy: 'id'},
    loginAccessibilityId: {selector: 'mobilelogin', locateStrategy: 'accessibility id'}
  },
  sections: {
    signUp: {
      selector: '#signupSection',
      sections: {
        getStarted: {
          selector: '#getStarted',
          elements: {
            start: {selector: '#getStartedStart'}
          }
        }
      },
      elements: {
        help: {selector: '#helpBtn'}
      }
    },
    propTest: {
      selector: '#propTest',
      props: function () {
        const defaults = {};
        defaults[this.name] = this.selector + ' Value';

        return {
          defaults
        };
      }
    }
  },
  commands: [testCommands],
  props: function () {
    return {
      prop: 'example',
      url: this.url
    };
  }
};
