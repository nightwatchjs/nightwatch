module.exports = {
  commands: [{
    open() {
      this.api.url('https://t4v67b.csb.app/');
      // loading the code sandbox can take some time
      this.waitForElementVisible('@button', 30000);
    },
    selectValueTen() {
      this.click('@button');

      const dialog = this.section.dialog;
      dialog.waitUntilVisible();
      dialog.selectValueTen();
      dialog.close();
    }
  }],
  elements: {
    button: '#demo-button'
  },
  sections: {
    dialog: {
      selector: 'body',
      elements: {
        root: '#demo-dialog',
        select: '#demo-dialog-select',
        ten: '[data-value="10"]',
        ok: '#demo-dialog-ok'
      },
      commands: [{
        waitUntilVisible() {
          this.waitForElementVisible('@root');
        },
        selectValueTen() {
          // select menu opens and shows the items
          this.click('@select');
          this.waitForElementVisible('@ten');
          // wait for animation to finish
          this.pause(200);
          // click "Ten"
          this.click('@ten');
          // select menu closes
          this.waitForElementNotPresent('@ten');
        },
        close() {
          this.click('@ok'); // click the "ok" button in the dialog
          this.waitForElementNotPresent('@root'); // the dialog should be gone now
        }
      }]
    }
  }
};