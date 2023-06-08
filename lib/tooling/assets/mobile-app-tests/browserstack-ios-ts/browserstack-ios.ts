import {NightwatchAPI} from 'nightwatch';

module.exports = {
  'Verify text entered matches with output text': async function(app: NightwatchAPI) {
    app
      .useXpath()
      .waitForElementVisible('//XCUIElementTypeButton[@name="Text Button"]')
      .click('//XCUIElementTypeButton[@name="Text Button"]')
      .waitForElementVisible('//XCUIElementTypeTextField[@name="Text Input"]')
      .click('//XCUIElementTypeTextField[@name="Text Input"]')
      .sendKeys('//XCUIElementTypeTextField[@name="Text Input"]', 'BrowserStack')
      .click('//XCUIElementTypeButton[@name="Return"]')
      .assert.textEquals('//XCUIElementTypeStaticText[@name="Text Output"]', 'BrowserStack');

    app.end();
  }
};
