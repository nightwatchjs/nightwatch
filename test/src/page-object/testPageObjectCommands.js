var assert = require('assert');
var path = require('path');
var Globals = require('../../lib/globals.js');
var MockServer  = require('../../lib/mockserver.js');
var Nightwatch = require('../../lib/nightwatch.js');

module.exports = {
  'test PageObject Commands' : {
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

    testPageObjectElementCommandWithMutliArgs : function(done) {
      MockServer.addMock({
        url : '/wd/hub/session/1352110219202/element/0/value',
        method:'POST',
        postdata : '{"value":["1"]}',
        response : JSON.stringify({
          sessionId: '1352110219202',
          status:0
        })
      }, true);

      var page = this.client.api.page.simplePageObj();
      page.setValue('@loginCss', '1', function callback(result) {
        assert.equal(result.status, 0);
        done();
      });

      this.client.start();
    },

    testPageObjectElementRecursion : function(done) {
      MockServer.addMock({
        'url' : '/wd/hub/session/1352110219202/element/1/click',
        'response' : JSON.stringify({
          sessionId: '1352110219202',
          status:0
        })
      }, this);
      var client = this.client;
      var section = client.api.page.simplePageObj().section.signUp;
      section.click('@help', function callback(result) {
        assert.equal(result.status, 0);
      });

      client.api.perform(function() {
        assert.equal(client.locateStrategy, 'css selector');
        done();
      });
      this.client.start();
    },

    testPageObjectPluralElementRecursion : function(done) {
      var section = this.client.api.page.simplePageObj().section.signUp;
      section.waitForElementPresent('@help', 1000, true, function callback(result) {
        assert.equal(result.status, 0);
        assert.equal(result.value.length, 1);
        assert.equal(result.value[0].ELEMENT, '1');
        done();
      });

      this.client.start();
    },

    testPageObjectElementCommandSwitchLocateStrategy : function(done) {
      MockServer.addMock({
        'url' : '/wd/hub/session/1352110219202/element/0/click',
        'response' : JSON.stringify({
          sessionId: '1352110219202',
          status:0
        })
      }, true);
      MockServer.addMock({
        'url' : '/wd/hub/session/1352110219202/element/0/click',
        'response' : JSON.stringify({
          sessionId: '1352110219202',
          status:0
        })
      }, true);

      var page = this.client.api.page.simplePageObj();

      page.click('@loginCss', function callback(result) {
        assert.equal(result.status, 0);
      }).click('@loginXpath', function callback(result) {
        assert.equal(result.status, 0);
        done();
      });

      this.client.start();
    },

    testPageObjectInvalidElementCommand : function(done) {
      var page = this.client.api.page.simplePageObj();

      assert.throws(
        function() {
          page.click('@invalidElement');
        }, 'Element command on an invalid element should throw exception'
      );
      done();
    },

    testPageObjectPropsFunctionReturnsObject : function() {
      var page = this.client.api.page.simplePageObj();

      assert.equal(typeof page.props, 'object', 'props function should be called and set page.props equals its returned object');
      assert.equal(page.props.url, page.url, 'props function should be called with page context');
    },

    testSectionObjectPropsFunctionReturnsObject : function() {
      var page = this.client.api.page.simplePageObj();

      assert.equal(typeof page.section.propTest.props, 'object', 'props function should be called and set page.props equals its returned object');
      assert.ok(page.section.propTest.props.defaults.propTest, 'props function should be called with page context');
      assert.equal(page.section.propTest.props.defaults.propTest, '#propTest Value' );
    }
  }
};
