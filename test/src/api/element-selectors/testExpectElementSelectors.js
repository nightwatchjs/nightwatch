const path = require('path');
const assert = require('assert');
const nocks = require('../../../lib/nockselements.js');
const MockServer  = require('../../../lib/mockserver.js');
const Nightwatch = require('../../../lib/nightwatch.js');

describe('test expect element selectors', function() {

  before(function(done) {
    nocks.enable();
    this.server = MockServer.init();
    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    nocks.disable();
    this.server.close(function() {
      done();
    });
  });

  beforeEach(function (done) {
    nocks.cleanAll();
    Nightwatch.init({
      page_objects_path: [path.join(__dirname, '../../../extra/pageobjects')]
    }, done);
  });


  it('passing expect selectors', function (done) {
    nocks
      .elementsFound()
      .elementsFound('#signupSection', [{ELEMENT: '0'}])
      .elementsId(0, '#helpBtn', [{ELEMENT: '0'}, {ELEMENT: '1'}])
      .elementsByXpath();

    let api = Nightwatch.api();
    api.globals.abortOnAssertionFailure = false;

    let page = api.page.simplePageObj();
    let section = page.section.signUp;

    let passingAssertions = [
      api.expect.element('.nock').to.be.present.before(1),
      api.expect.element({selector: '.nock'}).to.be.present.before(1),
      api.expect.element({selector: '//[@class="nock"]', locateStrategy: 'xpath'}).to.be.present.before(1),
      page.expect.section('@signUp').to.be.present.before(1),
      page.expect.section({selector: '@signUp', locateStrategy: 'css selector'}).to.be.present.before(1),
      section.expect.element('@help').to.be.present.before(1)
    ];

    api.perform(function() {
      passingAssertions.forEach(function(expect, index) {
        assert.equal(expect.assertion.passed, true, 'passing [' + index + ']: ' + expect.assertion.message);
      });
    });

    Nightwatch.start(done);
  });


  it('failing expect selectors - xpath .nock', function (done) {
    nocks
      .elementsFound()
      .elementsByXpathError();

    let api = Nightwatch.api();
    api.globals.abortOnAssertionFailure = false;

    let expect = api.expect.element({selector: '.nock', locateStrategy: 'xpath'}).to.be.present.before(1);

    api.perform(function() {
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.includes('element was not found'));
    });

    Nightwatch.start(done);
  });

  it('unknown/invalid expect methods', function () {
    nocks
      .elementsFound()
      .elementsFound('#signupSection', [{ELEMENT: '0'}]);

    let api = Nightwatch.api();
    api.globals.abortOnAssertionFailure = false;

    assert.throws(function() {
      api.expect.element('.nock').to.be.hidden;
    }, /Error: Unknown property: "hidden"\. Please consult docs at: http:\/\/nightwatchjs\.org\/api\./);

    Nightwatch.start();
  });

  it('failing expect selectors - xpath @signUp', function () {
    nocks
      .elementsFound()
      .elementsFound('#signupSection')
      .elementsByXpath();

    let api = Nightwatch.api();
    api.globals.abortOnAssertionFailure = false;

    let page = api.page.simplePageObj();
    try {
      page.expect.section({selector: '@signUp', locateStrategy: 'xpath'}).to.be.present;
    } catch (err) {
      assert.ok(err instanceof Error);
      assert.equal(err.message, 'Section "signUp[locateStrategy=\'xpath\']" was not found in "simplePageObj". Available sections: signUp[locateStrategy=\'css selector\'], propTest[locateStrategy=\'css selector\']');
    }
    Nightwatch.start();
  });
});
