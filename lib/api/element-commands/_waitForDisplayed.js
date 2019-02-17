const WaitForElement = require('./_waitFor.js');

class WaitForDisplayed extends WaitForElement {
  protocolAction() {
    return this.executeProtocolAction('isElementDisplayed');
  }

  performActionWithElement() {
    return super.performActionWithElement()
      .then(result => {
        const now = new Date().getTime();

        if (WaitForElement.isElementVisible(result)) {
          return this.elementVisible({result, now});
        }

        return this.elementNotVisible({result, now});
      });
  }

  elementVisible({result, now}) {
  }

  elementNotVisible({result, now}) {
  }

}

module.exports = WaitForDisplayed;
