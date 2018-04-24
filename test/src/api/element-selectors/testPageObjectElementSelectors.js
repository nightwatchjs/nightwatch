const path = require('path');
const assert = require('assert');
const nocks = require('../../../lib/nockselements.js');
const MockServer = require('../../../lib/mockserver.js');
const Nightwatch = require('../../../lib/nightwatch.js');

describe('test page object element selectors', function() {
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

  beforeEach(function(done) {
    Nightwatch.init({
      page_objects_path: [path.join(__dirname, '../../../extra/pageobjects')]
    }, done);
  });

  afterEach(function() {
    nocks.cleanAll();
  });

  it('page elements', function(done) {
    nocks
      .elementFound('#weblogin')
      .elementFound('weblogin', 'id')
      .elementByXpath('//weblogin')
      .elementByXpath('#weblogin', [])
      .text(0, 'first')
      .text(1, 'second');

    // var client = Nightwatch.client();
    // Api.init(client);
    //
    let page = Nightwatch.api().page.simplePageObj();

    page
      .getText('@loginAsString', function callback(result) {
        assert.equal(result.status, 0, 'element selector string found');
        assert.equal(result.value, 'first', 'element selector string value');
      })
      .getText({selector: '@loginAsString'}, function callback(result) {
        assert.equal(result.status, 0, 'element selector property found');
        assert.equal(result.value, 'first', 'element selector property value');
      })
      .getText('@loginXpath', function callback(result) {
        assert.equal(result.status, 0, 'element selector xpath found');
        assert.equal(result.value, 'first', 'element selector xpath value');
      })
      .getText('@loginCss', function callback(result) {
        assert.equal(result.status, 0, 'element selector css found');
        assert.equal(result.value, 'first', 'element selector css value');
      })
      .getText('@loginId', function callback(result) {
        assert.equal(result.status, 0, 'element selector id found');
        assert.equal(result.value, 'first', 'element selector id value');
      })
      .api.perform(function() {
      done();
    });

    Nightwatch.start();
  });

  it('page section elements', function(done) {
    nocks
      .elementFound('#signupSection')
      .elementFound('#getStarted')
      .elementFound('#helpBtn')
      .elementIdNotFound(0, '#helpBtn', 'xpath')
      .elementId(0, '#helpBtn')
      .text(0, 'first')
      .text(1, 'second');

    // var client = Nightwatch.client();
    // Api.init(client);
    //
    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;
    let sectionChild = section.section.getStarted;

    section
      .getText('@help', function callback(result) {
        assert.equal(result.status, 0, 'section element selector string found');
        assert.equal(result.value, 'first', 'section element selector string value');
      })
      .getText({selector: '@help'}, function callback(result) {
        assert.equal(result.status, 0, 'section element selector property found');
        assert.equal(result.value, 'first', 'section element selector property value');
      })
      .getText({selector: '@help', locateStrategy: 'xpath'}, function callback(result) {
        assert.equal(result.status, -1, 'section element selector css xpath override not found');
      });

    sectionChild
      .getText('#helpBtn', function callback(result) {
        assert.equal(result.status, 0, 'child section element selector string found');
        assert.equal(result.value, 'first', 'child section element selector string value');
      })
      .getText({selector: '#helpBtn'}, function callback(result) {
        assert.equal(result.status, 0, 'child section element selector property found');
        assert.equal(result.value, 'first', 'child section element selector property value');
      })
      .api.perform(function() {
      done();
    });

    Nightwatch.start();
  });

});
