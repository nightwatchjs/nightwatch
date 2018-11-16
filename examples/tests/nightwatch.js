const assert = require('assert');

module.exports = {
  disabled : true,
  '@tags': ['website'],

  beforeEach: function(client, done) {
    client.url('http://nightwatchjs.org?beforeEach', function() {
      done();
    });
  },

  'Demo test NightwatchJS.org' : function (client) {
    client
      .waitForElementVisible('body', 1000)
      .elements('css selector', '#index-container ul.features li', function (result) {
        for (var i = 0; i < result.value.length; i++) {
          var selector = '#index-container ul.features li:nth-child(' + i +') p';
          //assert.equal(typeof selector, 'sstring')
          client.assert.elementPresent(selector);
        }
      });
  },

  'Finished': function(client) {
    client
      .perform(() => {
        console.log('[perform]: Finished Test:', client.currentTest.name)
      })
      .end();
  }
};
