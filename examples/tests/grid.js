module.exports = {
    'should simply open and close': function (browser) {
        browser
          .url('http://github.com/beatfactor/nightwatch')
          .pause(1000)
          .end();
    }
 };