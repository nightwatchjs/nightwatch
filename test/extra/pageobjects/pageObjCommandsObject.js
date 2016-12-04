module.exports = {
  elements: {},
  commands: {
    testCommand : function() {
      return this;
    }
  },

  sections: {
    signUp: {
      selector: '#signupSection',
      commands: {
        testCommand : function() {
          return this;
        }
      }
    }
  }
};
