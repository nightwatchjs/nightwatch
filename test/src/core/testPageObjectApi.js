var assert = require('assert');
var Globals = require('../../lib/globals.js');
var Nocks = require('../../lib/nocks.js');
var Nightwatch = require('../../lib/nightwatch.js');
var path = require('path');

module.exports = {
  'test PageObjectApi' : {
    beforeEach: function (done) {
      Globals.interceptStartFn();
      Nocks.cleanAll().createSession();
      Nightwatch.init({
        page_objects_path: path.join(__dirname, '../../extra/pageobjects')
      }, function () {
        done();
      });
      this.client = Nightwatch.client();
    },

    afterEach: function () {
      Nocks.deleteSession();
      Globals.restoreStartFn();
    },

    testPageObjectProperties: function () {
      var page = this.client.api.page.simplePageObj();
      assert.ok('elements' in page);
      assert.ok('name' in page);
      assert.ok('section' in page);
      assert.ok('url' in page);
      assert.ok('api' in page);
      assert.ok('client' in page);
      assert.ok('testCommand' in page);

      assert.equal(typeof page.api, 'object');
      assert.equal(typeof page.client, 'object');
      assert.equal(typeof page.elements, 'object');
      assert.equal(page.name, 'simplePageObj');
      assert.equal(page.url, 'http://localhost.com');
      assert.equal(page.testCommand(), page);

      assert.ok('loginCss' in page.elements);
      assert.ok('loginXpath' in page.elements);
      assert.ok('signUp' in page.section);

      assert.ok('help' in page.section.signUp.elements);
      assert.ok('getStarted' in page.section.signUp.section);

      var elements = page.elements;
      assert.equal(elements.loginCss.selector, '#weblogin');
      assert.equal(elements.loginCss.locateStrategy, 'css selector');
      assert.equal(elements.loginXpath.selector, '//weblogin');
      assert.equal(elements.loginXpath.locateStrategy, 'xpath');
      assert.equal(elements.loginAsString.selector, '#weblogin');
      assert.equal(elements.loginAsString.locateStrategy, 'css selector');
    },

    testPageObjectElementsArray: function () {
      var page = this.client.api.page.pageObjElementsArray();
      assert.ok('elements' in page);

      assert.ok('someElement' in page.elements);
      assert.ok('otherElement' in page.elements);
      assert.equal(page.elements.someElement.selector, '#element');
      assert.equal(page.elements.otherElement.selector, '#otherElement');
    },

    testPageObjectSubDirectory : function() {
      assert.ok('addl' in this.client.api.page);
      assert.ok('simplePageObject' in this.client.api.page.addl);
    },

    testPageObjectAssertionsLoaded: function () {
      var page = this.client.api.page.simplePageObj();

      assert.ok('assert' in page);
      assert.ok('verify' in page);
      assert.ok('expect' in page);
      assert.ok('title' in page.assert);
      assert.ok('title' in page.verify);
      assert.ok('containsText' in page.assert);
      assert.ok('containsText' in page.verify);
      assert.ok('ok' in page.assert);
      assert.ok('ok' in page.verify);
      assert.ok('element' in page.expect);
      assert.ok('section' in page.expect);
      assert.equal(typeof page.assert.containsText, 'function');
      assert.equal(typeof page.verify.containsText, 'function');
      assert.equal(typeof page.assert.title, 'function');
      assert.equal(typeof page.verify.title, 'function');
      assert.equal(typeof page.expect.element('@loginCss'), 'object');
      assert.equal(typeof page.expect.section('signUp'), 'object');
    },

    testPageObjectCommandsLoaded: function () {
      var page = this.client.api.page.simplePageObj();

      assert.ok('click' in page);
      assert.ok('waitForElementPresent' in page);
      assert.ok(!('end' in page));
      assert.ok(!('switchWindow' in page));
    }
  }
};
