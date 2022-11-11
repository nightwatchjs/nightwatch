const assert = require('assert');
const path = require('path');
const MockServer = require('../../lib/mockserver.js');
const Nightwatch = require('../../lib/nightwatch.js');

describe('test PageObject Custom Commands', function () {
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
    assert.strictEqual(typeof page.dropdownSelect, 'function');
    assert.strictEqual(typeof page.testCommand, 'function');
    assert.strictEqual(typeof page.getUrl, 'function');

  });

  it('testPageObject - custom commands class definition', function () {
    let api = this.client.api;

    const page = api.page.simplePageObjWithCommandsClass();

    assert.strictEqual(typeof page.basicCommand, 'function');
    assert.strictEqual(typeof page.dropdownSelectByText, 'function');
    assert.strictEqual(typeof page.dropdownSelect, 'function');
    assert.strictEqual(typeof page.scrollToElement, 'function');
    assert.strictEqual(page.name, 'simplePageObjWithCommandsClass');
    assert.strictEqual(typeof page.getUrl, 'function');

    const result = page.basicCommand();
    assert.deepStrictEqual(result, {
      basicResult: 'from-helper-class',
      otherResult: 'from-other-helper-class'
    });

  });

  it('testPageObject - custom commands class definition - throws Error', function () {
    let api = this.client.api;
    let expectedError;
    try {
      const page = api.page.simplePageObjWithCommandsClassThrowsError();
    } catch (err) {
      expectedError = err;
    }

    assert.ok(expectedError instanceof Error, 'Expected error was not thrown');
    assert.strictEqual(expectedError.message, 'Trying to overwrite page object/section "simplePageObjWithCommandsClassThrowsError"  method/property "name".');
    assert.strictEqual(expectedError.detailedErr, 'Using basicCommand,dropdownSelect,dropdownSelectByText,name.');
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

    const page = api.page.simplePageObjWithCommandsObject().customExecute({prop: true});

    return this.client.start();
  });

  it('testPageObject - error loading custom commands', function (done) {
    let api = this.client.api;

    try {
      api.page.simplePageObjWithError();
    } catch (err) {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Trying to overwrite page object/section "simplePageObjWithError"  method/property "name".');
      assert.strictEqual(err.detailedErr, 'Using dropdownSelect, dropdownSelectByText, scrollToElement, name, testCommand.');

      done();
    }
  });
});

