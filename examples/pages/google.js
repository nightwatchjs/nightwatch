module.exports = function (browser) {
  // The page object is simply a class which receives the nightwatch object
  // as an argument in the constructor

  // Each action is written as a separate method which must return the browser
  // object in order to be able to be queued
  this.goToGoogle = function() {
    browser
      .url('http://google.com')
      .waitForElementVisible('body', 1000);

    return browser;
  };
};