const WaitForElement = require('./_waitFor.js');

class WaitForDisplayed extends WaitForElement {
  protocolAction() {
    return this.executeProtocolAction('isElementDisplayed');
  }

  performActionWithElement(response) {
    return super.performActionWithElement(response)
      .then(result => {
        const now = new Date().getTime();

        if (WaitForElement.isElementVisible(result)) {
          return this.elementVisible({result, now});
        }

        return this.elementNotVisible({result, now});
      });
  }

  elementVisible(response) {}
  elementNotVisible(response) {}
}

module.exports = WaitForDisplayed;
