/**
 * Sample automated test scenario for Nightwatch.js
 *
 * > it navigates to page that has onbeforeunload handler
 */

module.exports = {
  disabled: true,

  'go to page with unload handler': function(client) {
    client
      .url('http://www.4guysfromrolla.com/demos/OnBeforeUnloadDemo1.htm')
      .waitForElementVisible('body', 1000);
  },

  'navigate away from page WITH unload handler': function(client) {
    var hasDialog = false;

    client
      .hasOnBeforeUnload(function(result) {
        this.verify.equal(result, true, 'The page should have an onbeforeunload handler');
        hasDialog = result;
      })
      .url('http://google.com', function() {
        if (hasDialog) {
          this.acceptAlert();
        }
      })
      .waitForElementVisible('body', 1000);

  },

  'go to nightwatch' : function(c) {
    c.url('http://nightwatchjs.org')
      .waitForElementVisible('body', 1000);
  },

  after : function(c) {
    c.end();
  }
};