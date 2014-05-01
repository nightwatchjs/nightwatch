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

  'navigate away from page WITH unload handler': function(client) {
    var hasDialog = false;

    client
      .hasOnBeforeUnload(function(result) {
        this.verify.equal(result, true, 'The page should have an onbeforeunload handler');
        hasDialog = result;
        this.click('a.cancel');
      })
      .url('http://google.com', function() {
        if (hasDialog) {
          this.acceptAlert();
        }
      })
      .ifElementVisible('body', 1000, false, function(found) {
        if (found.value) {
          console.log('ifElementVisible callback', found);

        }
      })
      .end();
  },

  tearDown : function() {
    console.log(this.results)
    console.log(this.errors);
  }
};
