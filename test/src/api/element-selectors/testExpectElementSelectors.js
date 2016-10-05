var path = require('path');
var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');
var utils = require('../../../lib/utils.js');
var nocks = require('../../../lib/nockselements.js');
var MochaTest = require('../../../lib/mochatest.js');
var Nightwatch = require('../../../lib/nightwatch.js');

module.exports = MochaTest.add('test expect element selectors', {

  beforeEach: function (done) {
    Nightwatch.init({
      page_objects_path: [path.join(__dirname, '../../../extra/pageobjects')]
    }, done);
  },

  afterEach: function () {
    nocks.cleanAll();
  },

  'expect selectors' : function (done) {
    nocks
      .elementsFound()
      .elementsFound('#signupSection', [{ELEMENT: '0'}])
      .elementsId(0, '#helpBtn', [{ELEMENT: '0'}])
      .elementsByXpath();

    var client = Nightwatch.client();
    Api.init(client);
    var api = client.api;
    api.globals.abortOnAssertionFailure = false;

    var page = api.page.simplePageObj();
    var section = page.section.signUp;

    var passes = [
      api.expect.element('.nock').to.be.present.before(1),
      api.expect.element({selector: '.nock'}).to.be.present.before(1),
      api.expect.element({selector: '//[@class="nock"]', locateStrategy: 'xpath'}).to.be.present.before(1),
      page.expect.section('@signUp').to.be.present.before(1),
      page.expect.section({selector: '@signUp', locateStrategy: 'css selector'}).to.be.present.before(1),
      section.expect.element('@help').to.be.present.before(1)
    ];

    var fails = [
      [api.expect.element({selector: '.nock', locateStrategy: 'xpath'}).to.be.present.before(1),
        'element was not found'],
      [page.expect.section({selector: '@signUp', locateStrategy: 'xpath'}).to.be.present.before(1),
        'element was not found']
    ];

    api.perform(function(performDone) {
      process.nextTick(function(){ // keep assertions from being swallowed by perform

        passes.forEach(function(expect, index) {
          assert.equal(expect.assertion.passed, true, 'passing [' + index + ']: ' + expect.assertion.message);
        });

        fails.forEach(function(expectArr, index) {
          var expect = expectArr[0];
          var msgPartial = expectArr[1];

          assert.equal(expect.assertion.passed, false, 'failing [' + index + ']: ' + expect.assertion.message);
          assert.notEqual(expect.assertion.message.indexOf(msgPartial), -1, 'Message contains: ' + msgPartial);
        });
        
        performDone();
        done();

      });
    });

    Nightwatch.start();
  }

});
