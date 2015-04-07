var MockServer  = require('mockserver');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init({
      page_objects_path: './extra/pageobjects'
    });

    callback();
  },

  testPageObjectElementCommandWithMutliArgs : function(test) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/value',
      method:'POST',
      postdata : '{"value":["1"]}',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    var page = this.client.api.page.simplePageObj();

    page.setValue('loginCss', '1', function callback(result) {
      test.equals(result.status, 0);
      test.done();
    });
  },

  testPageObjectElementCommandSwitchLocateStrategy : function(test) {
    MockServer.addMock({
      'url' : '/wd/hub/session/1352110219202/element/0/click',
      'response' : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    var page = this.client.api.page.simplePageObj();

    page.click('loginCss', function callback(result) {
      test.equals(result.status, 0);
    }).click('loginXpath', function callback(result) {
      test.equals(result.status, 0);
      test.done();
    });
  },

  testPageObjectInvalidElementCommand : function(test) {
    var page = this.client.api.page.simplePageObj();

    test.throws(
      function() {
        page.click('invalidElement');
      }, 'Element command on an invalid element should throw exception'
    );
    test.done();
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
