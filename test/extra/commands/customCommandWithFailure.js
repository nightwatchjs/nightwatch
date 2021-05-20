module.exports = {
  command: function(cb) {
    this.waitForElementPresent('#badElement', 100);
  }
};
