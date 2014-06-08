/**
 * =============================================================================
 * Demo of Facebook Connect automated login with Nightwatch.js.
 * The test navigates to digg.com and tries to perform a Facebook connect login.
 *
 * This test requires a fbcredentials.json file to be placed in the same
 * folder, containing the facebook username and password in the form below:
 * -----
 * {
 *   "username" : "",
 *   "password" : ""
 * }
 * -----
 * The test only works if you have the permissions ALREADY enabled for digg.com
 * in your facebook account.
 * =============================================================================
 */

module.exports = {
  disabled : true,

  'digg facebook login' : function (client) {
    var fbcredentials;
    try {
      fbcredentials = require('./fbcredentials.json');
    } catch (err) {
      console.error('Couldn\'t load the facebook credentials file. Please ensure that ' +
        'you have the fbcredentials.json in the same folder as the test.');
      process.exit();
    }

    client
      .url('http://digg.com')
      .waitForElementVisible('body', 1000)
      .click('#nav-signin')
      .click('#btn-facebook-auth-topnav')
      .windowHandles(function(result) {
        client.assert.equal(result.value.length, 2, 'There should be two windows open.');
        var fbWindowHandle = result.value[1];
        client.switchWindow(fbWindowHandle);
      })
      .waitForElementVisible('#facebook body', 1000)
      .setValue('input#email', fbcredentials.username)
      .setValue('input#pass', fbcredentials.password)
      .click('#loginbutton input')
      .windowHandles(function(result) {
        client.assert.equal(result.value.length, 1, 'There should be only one window open.');
        client.switchWindow(result.value[0]);
      })
      .waitForElementVisible('#digg-header.authenticated', 3000)
      .end();
  }
};
