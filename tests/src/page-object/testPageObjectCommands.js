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
    page.setValue('@loginCss', '1', function callback(result) {
      test.equals(result.status, 0);
      test.done();
    });
  },

  testPageObjectElementRecursion : function(test) {
    MockServer.addMock({
      'url' : '/wd/hub/session/1352110219202/element/1/click',
      'response' : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    var section = this.client.api.page.simplePageObj().section.signUp;
    var client = this.client;
    section.click('@help', function callback(result) {
      test.equals(result.status, 0);
    });

    client.api.perform(function() {
      test.equals(client.locateStrategy, 'css selector');
      test.done();
    });
  },

  testPageObjectPluralElementRecursion : function(test) {
    var section = this.client.api.page.simplePageObj().section.signUp;
    section.waitForElementPresent('@help', 1000, true, function callback(result) {
      test.equals(result.status, 0);
      test.equals(result.value.length, 1);
      test.equals(result.value[0].ELEMENT, '1');
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

    page.click('@loginCss', function callback(result) {
      test.equals(result.status, 0);
    }).click('@loginXpath', function callback(result) {
      test.equals(result.status, 0);
      test.done();
    });
  },

  testPageObjectInvalidElementCommand : function(test) {
    var page = this.client.api.page.simplePageObj();

    test.throws(
      function() {
        page.click('@invalidElement');
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
