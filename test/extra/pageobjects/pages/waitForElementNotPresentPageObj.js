module.exports = {
  commands: [{
    waitForElementNotPresentDemo(cb) {
      this.click('@button')
      const dialog = this.section.dialog;
      dialog.selectValueDemo(cb)
    }
  }],
  elements: {
    button: '#weblogin'
  },
  sections: {
    dialog: {
      selector: '#weblogin',
      elements: {
        select: '#badElement'
      },
      commands: [{
        selectValueDemo(cb) {
          this.waitForElementNotPresent('@select', cb);
        }
      }]
    }
  }
};
