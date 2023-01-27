const assert = require('assert');
const path = require('path');
const Nocks = require('../../lib/nocks.js');
const Nightwatch = require('../../lib/nightwatch.js');

describe('test PageObjectApi', function () {
  beforeEach(function (done) {
    Nocks.enable().cleanAll().createSession();
    Nightwatch.init({
      page_objects_path: path.join(__dirname, '../../extra/pageobjects/pages'),
      plugins: [path.join(__dirname, '../../extra/plugin')]
    }, function () {
      done();
    });
    this.client = Nightwatch.client();
    //this.client.initialize().then(() => done());
  });

  afterEach(function () {
    Nocks.deleteSession().disable();
  });

  it('testPageObjectProperties', function () {
    const page = this.client.api.page.simplePageObj();
    assert.ok('elements' in page);
    assert.ok('name' in page);
    assert.ok('section' in page);
    assert.ok('url' in page);
    assert.ok('api' in page);
    assert.ok('client' in page);
    assert.ok('testCommand' in page);

    assert.strictEqual(typeof page.api, 'object');
    assert.strictEqual(typeof page.client, 'object');
    assert.strictEqual(typeof page.elements, 'object');
    assert.strictEqual(page.name, 'simplePageObj');
    assert.strictEqual(page.url, 'http://localhost.com');
    assert.strictEqual(page.testCommand(), page);

    assert.ok('loginCss' in page.elements);
    assert.ok('loginXpath' in page.elements);
    assert.ok('signUp' in page.section);

    assert.ok('help' in page.section.signUp.elements);
    assert.ok('getStarted' in page.section.signUp.section);

    const elements = page.elements;
    assert.strictEqual(elements.loginCss.selector, '#weblogin');
    assert.strictEqual(elements.loginCss.locateStrategy, 'css selector');
    assert.strictEqual(elements.loginXpath.selector, '//weblogin');
    assert.strictEqual(elements.loginXpath.locateStrategy, 'xpath');
    assert.strictEqual(elements.loginAsString.selector, '#weblogin');
    assert.strictEqual(elements.loginAsString.locateStrategy, 'css selector');
  });

  it('testPageObjectElementsArray', function () {
    const page = this.client.api.page.pageObjElementsArray();
    assert.ok('elements' in page);

    assert.ok('someElement' in page.elements);
    assert.ok('otherElement' in page.elements);
    assert.strictEqual(page.elements.someElement.selector, '#element');
    assert.strictEqual(page.elements.otherElement.selector, '#otherElement');
  });

  it('testPageObjectSubDirectory', function () {
    assert.ok('addl' in this.client.api.page);
    assert.ok('simplePageObject' in this.client.api.page.addl);
  });

  it('testPageObjectAssertionsLoaded', function () {
    const page = this.client.api.page.simplePageObj();

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
    assert.strictEqual(typeof page.assert.containsText, 'function');
    assert.strictEqual(typeof page.verify.containsText, 'function');
    assert.strictEqual(typeof page.assert.title, 'function');
    assert.strictEqual(typeof page.verify.title, 'function');
    assert.strictEqual(typeof page.expect.element('@loginCss'), 'object');
    assert.strictEqual(typeof page.expect.section('signUp'), 'object');
  });

  it('testPageObjectCommandsLoaded', function () {
    const page = this.client.api.page.simplePageObj();

    assert.ok('click' in page);
    assert.ok('waitForElementPresent' in page);
    assert.ok('end' in page);
    assert.ok(!('switchToWindow' in page));
  });

  it('testPageObjectPluginLoaded', function() {

    const page = this.client.api.page.simplePageObj();

    assert.ok('customCommand' in page);
    assert.ok('customAssertion' in page.assert);
    assert.strictEqual(typeof page.customCommand, 'function');
    assert.strictEqual(typeof page.assert.customAssertion, 'function');
  });
});

