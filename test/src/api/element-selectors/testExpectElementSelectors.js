const path = require('path');
const assert = require('assert');
const nocks = require('../../../lib/nockselements.js');
const MockServer  = require('../../../lib/mockserver.js');
const Nightwatch = require('../../../lib/nightwatch.js');

describe('test expect element selectors', function() {

  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    this.server.close(function() {
      done();
    });
  });

  beforeEach(function (done) {
    Nightwatch.init({
      page_objects_path: [path.join(__dirname, '../../../extra/pageobjects')]
    }, done);
  });

  afterEach(function () {
    nocks.cleanAll();
  });


  it('expect selectors', function (done) {
    nocks
      .elementsFound()
      .elementsFound('#signupSection', [{ELEMENT: '0'}])
      .elementsId(0, '#helpBtn', [{ELEMENT: '0'}])
      .elementsByXpath();

    let api = Nightwatch.api();
    api.globals.abortOnAssertionFailure = false;

    let page = api.page.simplePageObj();
    let section = page.section.signUp;

    let passedAssertions = [
      api.expect.element('.nock').to.be.present.before(1),
      api.expect.element({selector: '.nock'}).to.be.present.before(1),
      api.expect.element({selector: '//[@class="nock"]', locateStrategy: 'xpath'}).to.be.present.before(1),
      page.expect.section('@signUp').to.be.present.before(1),
      page.expect.section({selector: '@signUp', locateStrategy: 'css selector'}).to.be.present.before(1),
      //section.expect.element('@help').to.be.present.before(1)
    ];

    let failedAssertions = [
      //[api.expect.element({selector: '.nock', locateStrategy: 'xpath'}).to.be.present.before(1), 'element was not found'],
      [page.expect.section({selector: '@signUp', locateStrategy: 'xpath'}).to.be.present.before(1), 'element was not found']
    ];

    api.perform(function() {
      passedAssertions.forEach(function(expect, index) {
        assert.equal(expect.assertion.passed, true, 'passing [' + index + ']: ' + expect.assertion.message);
      });
    }).perform(function() {
      failedAssertions.forEach(function(expectArr, index) {
        let expect = expectArr[0];
        let msgPartial = expectArr[1];

        assert.equal(expect.assertion.passed, false, 'failing [' + index + ']: ' + expect.assertion.message);
        assert.notEqual(expect.assertion.message.indexOf(msgPartial), -1, 'Message contains: ' + msgPartial);
      });
    });

    Nightwatch.start(done);
  });

});
