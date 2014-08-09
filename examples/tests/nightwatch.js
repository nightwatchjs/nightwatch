module.exports = {
  'Demo test NightwatchJS.org' : function (client) {
    client
      .url('http://nightwatchjs.org')
      .waitForElementVisible('body', 1000)
      .elements('css selector', '#index-container ul.features li', function (result) {

        for (var i = 0; i < result.value.length; i++) {
          var element = result.value[i];

          var selector = '#index-container ul.features li:nth-child(' + (element.ELEMENT ) +') em';
          client.verify.cssClassPresent(selector, 'glyphicon');
        }
      })
      .end();
  }
};
