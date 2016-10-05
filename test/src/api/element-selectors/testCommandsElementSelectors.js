var path = require('path');
var assert = require('assert');
var common = require('../../../common.js');
var Api = common.require('core/api.js');
var utils = require('../../../lib/utils.js');
var nocks = require('../../../lib/nockselements.js');
var MochaTest = require('../../../lib/mochatest.js');
var Nightwatch = require('../../../lib/nightwatch.js');

module.exports = MochaTest.add('test commands element selectors', {

  beforeEach: function (done) {
    Nightwatch.init({
      page_objects_path: [path.join(__dirname, '../../../extra/pageobjects')]
    }, done);
  },

  afterEach: function () {
    nocks.cleanAll();
  },

  // wrapped selenium command

  'getText(<various>)' : function(done) {
    nocks
      .elementFound()
      .elementNotFound()
      .elementByXpath()
      .text(0, 'first')
      .text(1, 'second');

    Nightwatch.api()
      .getText('#nock', function callback(result) {
        assert.equal(result.value, 'first', 'getText string selector value');
      })
      .getText({selector: '#nock'}, function callback(result) {
        assert.equal(result.value, 'first', 'getText selector property');
      })
      .getText({selector: '#nock-none'}, function callback(result) {
        assert.equal(result.status, -1, 'getText not found status');
      })
      .getText({selector: '//[@id="nock"]', locateStrategy: 'xpath'}, function callback(result) {
        assert.equal(result.value, 'first', 'getText xpath locateStrategy');
      })
      .perform(function() {
        done();
      });

    Nightwatch.start();
  },

  'getText(<various>) locateStrategy' : function(done) {
    nocks
      .elementFound()
      .elementNotFound()
      .elementByXpath()
      .text(0, 'first')
      .text(1, 'second');

    Nightwatch.api()
      .useCss()
      .getText('#nock', function callback(result) {
        assert.equal(result.value, 'first', 'getText string selector useCss');
      })
      .useXpath()
      .getText('//[@id="nock"]', function callback(result) {
        assert.equal(result.value, 'first', 'getText string selector useXpath');
      })
      .useCss()
      .getText({selector: '//[@id="nock"]', locateStrategy: 'xpath'}, function callback(result) {
        assert.equal(result.value, 'first', 'getText useCss override with xpath');
      })
      .getText('#nock', function callback(result) {
        assert.equal(result.value, 'first', 'getText back to css after override with xpath');
      })
      .getText('css selector', {selector: '//[@id="nock"]', locateStrategy: 'xpath'}, function callback(result) {
        assert.equal(result.value, 'first', 'getText using override with xpath');
      })
      .getText('xpath', {selector: '//[@id="nock"]'}, function callback(result) {
        assert.equal(result.value, 'first', 'getText using as xpath');
      })
      .perform(function() {
        done();
      });

    Nightwatch.start();
  },

  // custom command

  'waitForElementPresent(<various>)' : function(done) {
    nocks
      .elementsFound()
      .elementsNotFound()
      .elementsByXpath();

    Nightwatch.api()
      .waitForElementPresent('.nock', 1, false, function callback(result) {
        assert.equal(result.value.length, 3, 'waitforPresent result expected found');
      })
      .waitForElementPresent('.nock-none', 1, false, function callback(result) {
        assert.equal(result.value, false, 'waitforPresent result expected false');
      })
      .waitForElementPresent({selector: '.nock'}, 1, false, function callback(result) {
        assert.equal(result.value.length, 3, 'waitforPresent selector property result expected found');
      })
      .waitForElementPresent({selector: '.nock-none'}, 1, false, function callback(result) {
        assert.equal(result.value, false, 'waitforPresent selector property result expected false');
      })
      .perform(function() {
        done();
      });

    Nightwatch.start();
  },

  'waitForElementPresent(<various>) locateStrategy' : function(done) {
    nocks
      .elementsFound()
      .elementsNotFound()
      .elementsByXpath();

    Nightwatch.api()
      .useCss()
      .waitForElementPresent('.nock', 1, false, function callback(result) {
        assert.equal(result.value.length, 3, 'waitforPresent using css');
      })
      .useXpath()
      .waitForElementPresent('//[@class="nock"]', 1, false, function callback(result) {
        assert.equal(result.value.length, 3, 'waitforPresent using xpath');
      })
      .useCss()
      .waitForElementPresent({selector: '//[@class="nock"]', locateStrategy: 'xpath'}, 1, false, function callback(result) {
        assert.equal(result.value.length, 3, 'waitforPresent locateStrategy override to xpath found');
      })
      .perform(function() {
        done();
      });

    Nightwatch.start();
  }

});
