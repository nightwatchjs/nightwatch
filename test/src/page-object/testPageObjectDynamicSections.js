var assert = require('assert');
var path = require('path');
var Globals = require('../../lib/globals.js');
var MockServer  = require('../../lib/mockserver.js');
var Nightwatch = require('../../lib/nightwatch.js');

module.exports = {
  'test PageObject Dynamic Sections' : {
    before : function(done) {
      this.server = MockServer.init();
      Globals.interceptStartFn();
      this.server.on('listening', function() {
        done();
      });
    },
    after : function(done) {
      Globals.restoreStartFn();
      this.server.close(function() {
        done();
      });
    },
    beforeEach : function(done) {
      Nightwatch.init({
        page_objects_path: path.join(__dirname, '../../extra/pageobjects')
      }, function () {
        done();
      });

      this.client = Nightwatch.client();
    },

    testDynamicSectionSingleArg: function(done){
      MockServer.addMock({
        'url' : '/wd/hub/session/1352110219202/element/1/click',
        'response' : JSON.stringify({
          sessionId: '1352110219202',
          status:0
        })
      }, true);


      var page = this.client.api.page.simplePageObj();
      page.section.dynamicSingleArg('#signupSection').click('@bar', function callback(result){
        assert.equal(result.status, 0);
        done();
      });

      this.client.start();
    },

    testDynamicSectionMultiArgs: function(done){
      MockServer.addMock({
        'url' : '/wd/hub/session/1352110219202/element/1/click',
        'response' : JSON.stringify({
          sessionId: '1352110219202',
          status:0
        })
      }, true);

      var page = this.client.api.page.simplePageObj();

      page.section.dynamicMultiArgs('#signup', 'Section').click('@foobar', function callback(result){
        assert.equal(result.status, 0);
        done();
      });

      this.client.start();
    },

    testDynamicSectionNoArgs: function(done){
      MockServer.addMock({
        'url' : '/wd/hub/session/1352110219202/element/1/click',
        'response' : JSON.stringify({
          sessionId: '1352110219202',
          status:0
        })
      }, true);
      var page = this.client.api.page.simplePageObj();
      page.section.dynamicNoArgs().click('@foo', function callback(result){
        assert.equal(result.status, 0);
        done();
      });

      this.client.start();
    },

    testDynamicSectionDynamicElement: function(done) {
      MockServer.addMock({
        'url' : '/wd/hub/session/1352110219202/element/0/click',
        'response' : JSON.stringify({
          sessionId: '1352110219202',
          status:0
        })
      }, true);
      var page = this.client.api.page.simplePageObj();
      var section = page.section.dynamicMultiArgsDynamicElement('#signup', 'Section')

      section.click(section.$('@dynamicSingleArg', '#weblogin'), function callback(result){
        assert.equal(result.status, 0);
        done();
      });

      this.client.start();
    },
  }
};
