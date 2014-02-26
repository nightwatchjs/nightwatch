/**
 * Sample automated test scenario for Nightwatch.js
 *
 * > it navigates to page that has onbeforeunload handler
 */

module.exports = {
  'go to page with unload handler': function(client) {
    client
      .url('http://www.4guysfromrolla.com/demos/OnBeforeUnloadDemo1.htm')
      .waitForElementVisible('body', 1000);
  },

  'navigate away from page WITH unload handler (to page WITHOUT unload handler)': function(client) {
      // clear onbeforeunload handler and navigate
      client
        .url('http://google.com')
        .accept_alert();
  },

  'navigate away from page WITHOUT unload handler': function(client) {
    client
      .url('http://google.com')
      //.accept_alert() // this will raise exception
      .waitForElementVisible('body', 1000);
  },
  /*
  'navigate away from page WITHOUT unload handler (better way)': function(client) {
    client
      .url('http://google.com')
      .execute("return window && window.onbeforeunload;", [], function(result) {
          console.log(result);
          result.value && this.accept_alert();
      })
      .waitForElementVisible('body', 1000);
  },
   */
  'go BACK to page with unload handler': function(client) {
    client
      .url('http://www.4guysfromrolla.com/demos/OnBeforeUnloadDemo1.htm')
      .waitForElementVisible('body', 1000);
  },

  'navigate away from page WITH unload handler (better way ?)': function(client) {
    var hasDialog = false;
    client
      .execute(function() {
        return window && typeof window.onbeforeunload == 'function';
      }, [], function(result) {
        hasDialog = result.value;
      })
      .url('http://google.com', function() {
        console.info('hasDialog', hasDialog);
        if (hasDialog) {
          this.accept_alert();
        }
      })
      .waitForElementVisible('body', 1000);
  },

  'die' : function(client) {
      client.end();
  }
}