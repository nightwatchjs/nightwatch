const assert = require('assert');
const path = require('path');
const MockServer = require('../../lib/mockserver.js');
const Nightwatch = require('../../lib/nightwatch.js');

describe('test PageObject Commands', function () {
  before(function (done) {
    this.server = MockServer.init();

    this.server.on('listening', function () {
      done();
    });
  });

  after(function (done) {
    this.server.close(function () {
      done();
    });
  });

  beforeEach(function (done) {
    Nightwatch.init({
      page_objects_path: path.join(__dirname, '../../extra/pageobjects/pages')
    }, function () {
      done();
    });

    this.client = Nightwatch.client();
  });

  it('testPageObjectElementCommandWithMutliArgs', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/value',
      method: 'POST',
      postdata: '{"text":"1", "value":["1"]}',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    }, true);

    MockServer.addMock({
      'url': '/wd/hub/session/1352110219202/element/0/clear',
      postdata: {},
      'response': {
        sessionId: '1352110219202',
        status: 0
      }
    });

    let page = this.client.api.page.simplePageObj();
    page.setValue('@loginCss', '1', function callback(result) {
      assert.strictEqual(result.status, 0);
      done();
    });

    this.client.start();
  });

  it('testPageObjectCallbackContext', function(done) {
    let api = this.client.api;
    let page = api.page.simplePageObj();

    page
      .waitForElementPresent('#weblogin', 1000, true, function callback(result) {
        assert.strictEqual(this, api, 'page callback context using selector should equal api');
      })
      .waitForElementPresent('#weblogin', 1000, true, function callback(result) {
        assert.strictEqual(this, api, 'page callback context using selector with message should equal api');
      }, 'Test sample message')
      .waitForElementPresent('@loginCss', 1000, true, function callback(result) {
        assert.strictEqual(this, api, 'page callback context using element should equal api');
      })
      .waitForElementPresent('@loginCss', 1000, true, function callback(result) {
        assert.strictEqual(this, api, 'page callback context using element with message should equal api');
        done();
      }, 'Test sample message');

    this.client.start();
  });

  it('testPageObjectLocateStrategy', function(done) {
    let client = this.client;
    let page = client.api.page.simplePageObj();

    assert.strictEqual(client.locateStrategy, 'css selector', 'locateStrategy should default to css selector');

    page
      .waitForElementPresent('@loginXpath', 1000, true, function callback(result) {
        assert.ok(result.value, 'Element was not found.');
        assert.strictEqual(client.locateStrategy, 'css selector', 'locateStrategy should restore to previous css selector in callback when using xpath element');

        done();
      });

    this.client.start(function(err) {
      if (err) {
        done(err);
      }
    });
  });

  it('testPageObjectElementRecursion', function(done) {
    MockServer.addMock({
      'url': '/wd/hub/session/1352110219202/element/1/click',
      'response': JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    }, true);
    let client = this.client;
    let section = client.api.page.simplePageObj().section.signUp;
    section.click('@help', function callback(result) {
      assert.strictEqual(result.status, 0, result.value && result.value.message || 'An error occurred:\n' + JSON.stringify(result));
    });

    client.api.perform(function () {
      assert.strictEqual(client.locateStrategy, 'css selector');
    });
    this.client.start(err => done(err));
  });

  it('testPageObjectPluralElementRecursion', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/1/elements',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: [{ELEMENT: '1'}]
      })
    });

    let section = this.client.api.page.simplePageObj().section.signUp;
    section.waitForElementPresent('@help', 1000, true, function callback(result) {
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value.length, 1);
      assert.deepStrictEqual(result.value[0], {ELEMENT: '1'});
      assert.strictEqual(result.WebdriverElementId, '1');
    });

    this.client.start(function(err) {
      done(err);
    });
  });

  it('testPageObjectElementCommandSwitchLocateStrategy', function(done) {
    MockServer.addMock({
      'url': '/wd/hub/session/1352110219202/element/0/click',
      'response': JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    }, true);
    MockServer.addMock({
      'url': '/wd/hub/session/1352110219202/element/0/click',
      'response': JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    }, true);

    let page = this.client.api.page.simplePageObj();

    page.click('@loginCss', function callback(result) {
      assert.strictEqual(result.status, 0);
    }).click('@loginXpath', function callback(result) {
      assert.strictEqual(result.status, 0);
      done();
    });

    this.client.start();
  });

  it('testPageObjectInvalidElementCommand', function(done) {
    let page = this.client.api.page.simplePageObj();

    assert.throws(
      function () {
        page.click('@invalidElement');
      }, 'Element command on an invalid element should throw exception'
    );
    done();
  });

  it('testPageObjectPropsFunctionReturnsObject', function() {
    let page = this.client.api.page.simplePageObj();

    assert.strictEqual(typeof page.props, 'object', 'props function should be called and set page.props equals its returned object');
    assert.strictEqual(page.props.url, page.url, 'props function should be called with page context');
  });

  it('testSectionObjectPropsFunctionReturnsObject', function() {
    let page = this.client.api.page.simplePageObj();

    assert.strictEqual(typeof page.section.propTest.props, 'object', 'props function should be called and set page.props equals its returned object');
    assert.ok(page.section.propTest.props.defaults.propTest, 'props function should be called with page context');
    assert.strictEqual(page.section.propTest.props.defaults.propTest, '#propTest Value');
  });

  it('testPageObjectWithUrlChanged', function (done) {
    let page = this.client.api.page.simplePageObj();
    let urlsArr = [];
    page.api.url = function (url) {
      urlsArr.push(url);
    };

    page.navigate();

    page.api.perform(function () {
      page.url = function () {
        return 'http://nightwatchjs.org';
      };
    });

    page.api.perform(function () {
      page.navigate();
    });

    page.api.perform(function () {
      try {
        assert.deepStrictEqual(urlsArr, ['http://localhost.com', 'http://nightwatchjs.org']);
        done();
      } catch (err) {
        done(err);
      }
    });

    this.client.start();
  });

  it('testPageObject navigate() with url param', function (done) {
    let page = this.client.api.page.simplePageObj();
    let urlsArr = [];
    page.api.url = function (url) {
      urlsArr.push(url);
    };

    page.navigate('http://local');

    page.api.perform(function () {
      page.url = function () {
        return 'http://nightwatchjs.org';
      };
    });

    page.api.perform(function () {
      page.navigate();
    });

    page.api.perform(function () {
      try {
        assert.deepStrictEqual(urlsArr, ['http://local', 'http://nightwatchjs.org']);
        done();
      } catch (err) {
        done(err);
      }
    });

    this.client.start();
  });

  it('testPageObject navigate() with url param and callback', function (done) {
    let page = this.client.api.page.simplePageObj();
    let urlsArr = [];
    page.api.url = function (url, callback) {
      urlsArr.push(url);
      callback();
    };
    let called = false;
    page.navigate('http://local', function() {
      called = true;
    });

    page.api.perform(function () {
      try {
        assert.strictEqual(called, true);
        done();
      } catch (err) {
        done(err);
      }
    });

    this.client.start();
  });


  it('testPageObject navigate with url as a function using api object', function (done) {
    MockServer.addMock({
      'url': '/wd/hub/session/1352110219202/url',
      postdata: {'url': 'https://nightwatchjs.org'},
      'response': JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    }, true);

    const page = this.client.api.page.simplePageObj();
    page.api.launch_url = 'https://nightwatchjs.org';
    
    page.url = function (url) {
      return this.api.launch_url;
    };

    page.navigate(function (result) {
      //check if callback function is called
      assert.strictEqual(result.status, 0);
      done();
    });

    this.client.start();
  });
});

