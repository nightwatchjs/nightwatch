module.exports = {
  commands: require('../commands/workingCommandsClass.js'),
  url: 'http://localhost',

  elements: {
    loginAsString: '#weblogin'
  },

  props() {
    return {
      prop: 'example',
      url: this.url
    };
  }
};
