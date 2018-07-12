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
      page_objects_path: path.join(__dirname, '../../extra/pageobjects'),
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
});

