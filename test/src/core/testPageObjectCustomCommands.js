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
      page_objects_path: path.join(__dirname, '../../extra/pageobjects/pages'),
      custom_commands_path: [path.join(__dirname, '../../extra/commands')]
    }, function () {
      done();
    });

    this.client = Nightwatch.client();
  });

  it('testPageObjectCustomCommands', function (done) {
    let api = this.client.api;
    let page = api.page.simplePageObj();

    page
      .waitForElementPresent('#weblogin', 1000, true, function callback(result) {
        assert.strictEqual(this, api, 'page callback context using selector should equal api');
      })
      // just make sure page object contains custom command
      .customPerform(function () {
        done();
      });

    this.client.start();
  });

  it('testPageObject - custom commands object definition', function () {
    let api = this.client.api;

    const page = api.page.simplePageObjWithCommandsObject();
    assert.equal(typeof page.dropdownSelect, 'function');
    assert.equal(typeof page.testCommand, 'function');
    assert.equal(typeof page.getUrl, 'function');

  });

  it('testPageObject - custom command with args[0] as Array', function () {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute',
      method: 'POST'
    });
    let api = this.client.api;

    const page = api.page.simplePageObjWithCommandsObject().customExecute(['test']);

    return this.client.start();
  });

  it('testPageObject - custom command with args[0] as Object', function () {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute',
      method: 'POST'
    });
    let api = this.client.api;

    const page = api.page.simplePageObjWithCommandsObject().customExecute({ prop: true });

    return this.client.start();
  });

  it('testPageObject - error loading custom commands', function (done) {
    let api = this.client.api;

    try {
      api.page.simplePageObjWithError();
    } catch (err) {
      assert.ok(err instanceof Error);
      assert.equal(err.message, 'Trying to overwrite page object/section "simplePageObjWithError"  method/property "name".');
      assert.equal(err.detailedErr, 'Using dropdownSelect, dropdownSelectByText, scrollToElement, name, testCommand.' );

      done();
    }
  });
});

