module.exports = {
  setUp: function (callback) {
    callback();
  },

  testPageObjectProperties : function(test) {
    var client = this.client = require('../nightwatch.js').init({
      page_objects_path: './extra/pageobjects'
    });

    var page = client.api.page.simplePageObj();
    test.ok('elements' in page);
    test.ok('name' in page);
    test.ok('section' in page);
    test.ok('url' in page);
    test.ok('api' in page);
    test.ok('client' in page);
    test.ok('testCommand' in page);

    test.equal(typeof page.api, 'object');
    test.equal(typeof page.client, 'object');
    test.equal(page.name, 'simplePageObj');
    test.equal(page.url, 'http://localhost.com');
    test.equal(page.testCommand(), page);

    test.ok('loginCss' in page.elements);
    test.ok('loginXpath' in page.elements);
    test.ok('signUp' in page.section);

    test.ok('help' in page.section.signUp.elements);
    test.ok('getStarted' in page.section.signUp.section);

    var elements = page.elements;
    test.equal(elements.loginCss.selector, '#weblogin');
    test.equal(elements.loginCss.locateStrategy, 'css selector');
    test.equal(elements.loginXpath.selector, '//weblogin');
    test.equal(elements.loginXpath.locateStrategy, 'xpath');
    test.equal(elements.loginAsString.selector, '#weblogin');
    test.equal(elements.loginAsString.locateStrategy, 'css selector');

    test.done();
  },

  testPageObjectAssertionsLoaded : function(test) {
    var client = this.client = require('../nightwatch.js').init({
      page_objects_path: './extra/pageobjects'
    });

    var page = client.api.page.simplePageObj();

    test.ok('assert' in page);
    test.ok('verify' in page);
    test.ok('expect' in page);
    test.ok('title' in page.assert);
    test.ok('title' in page.verify);
    test.ok('containsText' in page.assert);
    test.ok('containsText' in page.verify);
    test.ok('ok' in page.assert);
    test.ok('ok' in page.verify);
    test.ok('element' in page.expect);
    test.ok('section' in page.expect);
    test.equal(typeof page.assert.containsText, 'function');
    test.equal(typeof page.verify.containsText, 'function');
    test.equal(typeof page.assert.title, 'function');
    test.equal(typeof page.verify.title, 'function');
    test.equal(typeof page.expect.element('@loginCss'), 'object');
    test.equal(typeof page.expect.section('signUp'), 'object');

    test.done();
  },

  testPageObjectCommandsLoaded : function(test) {
    var client = this.client = require('../nightwatch.js').init({
      page_objects_path: './extra/pageobjects'
    });

    var page = client.api.page.simplePageObj();

    test.ok('click' in page);
    test.ok('waitForElementPresent' in page);
    test.ok(!('end' in page));
    test.ok(!('switchWindow' in page));

    test.done();
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
