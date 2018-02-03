module.exports = {
  disabled : false,
  'Demo test NightwatchJS.org' : function (client) {
    client
      .url('http://nightwatchjs.org')
      .waitForElementVisible('body', 1000)
      .elements('css selector', '#index-container ul.features li', function (result) {
console.log(client.currentTest)
        for (var i = 0; i < result.value.length; i++) {
          var selector = '#index-container ul.features li:nth-child(' + i +') p';
          client.verify.elementPresent(selector);
        }
      })
      .end();
  }
};
