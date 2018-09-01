const path = require('path');
const assert = require('assert');
const nocks = require('../../../lib/nockselements.js');
const MockServer  = require('../../../lib/mockserver.js');
const Nightwatch = require('../../../lib/nightwatch.js');

describe('test index in element selectors', function() {

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

  it('calling protocol.element(using, {selector, index})', function (done) {
    nocks.elementFound();

    Nightwatch.api()
      .element('css selector', {selector: '#nock', index: 0}, function callback(result) {
        assert.equal(result.value.ELEMENT, '0', 'Found element, 0 index ignored');
      })
      .element('css selector', {selector: '#nock', index: 1}, function callback(result) {
        assert.equal(result.value.ELEMENT, '0', 'Found element, 1 index ignored');
      });

    Nightwatch.start(done);
  });

  it('calling protocol.elements(using, {selector, index})', function (done) {
    nocks.elementsFound();

    Nightwatch.api()
      .elements('css selector', {selector: '.nock', index: 0}, function callback(result) {
        assert.equal(result.value.length, 1, 'found index, one element');
        assert.equal(result.value[0].ELEMENT, '0', 'Found element 0');
      })
      .elements('css selector', {selector: '.nock', index: 1}, function callback(result) {
        assert.equal(result.value.length, 1, 'found index, one element');
        assert.equal(result.value[0].ELEMENT, '1', 'Found element 1');
      })
      .elements('css selector', {selector: '.nock', index: 2}, function callback(result) {
        assert.equal(result.value.length, 1, 'found index, one element');
        assert.equal(result.value[0].ELEMENT, '2', 'Found element 2');
      })
      .elements('css selector', {selector: '.nock', index: 999}, function callback(result) {
        assert.equal(result.value.length, 0, 'Out of range index, empty result set');
        assert.equal(result.status, -1, 'Not found for out of range index');
      });

    Nightwatch.start(done);
  });

  // wrapped selenium command

  it('calling getText(<various>, {index})', function (done) {
    nocks
      .elementsFound()
      .elementsByXpath()
      .text(0, 'first')
      .text(1, 'second');

    Nightwatch.api()
      .getText({selector: '.nock', index: 1}, function callback(result) {
        assert.equal(result.value, 'second', 'getText index 1');
      })
      .getText({selector: '//[@class="nock"]', locateStrategy: 'xpath', index: 1}, function callback(result) {
        assert.equal(result.value, 'second', 'getText xpath locateStrategy index 1');
      })
      .getText({selector: '//[@class="nock"]', locateStrategy: 'xpath', index: 999}, function callback(result) {
        assert.equal(result.status, -1, 'getText xpath locateStrategy out of range index');
      });

    Nightwatch.start(done);
  });

  // custom command

  it('calling waitForElementPresent(<various>, {index})', function (done) {
    nocks
      .elementsFound();

    Nightwatch.api()
      .waitForElementPresent({selector: '.nock', index: 1}, 1, false, function callback(result) {
        assert.equal(result.value.length, 1, 'waitforPresent index has results');
        assert.equal(result.value[0].ELEMENT, '1', 'waitforPresent found element 1');
      })
      .waitForElementPresent({selector: '.nock', index: 999}, 1, false, function callback(result) {
        assert.strictEqual(result.value, false, 'waitforPresent out of bounds index expected false');
      });

    Nightwatch.start(done);
  });

  it('using page elements with index', function (done) {
    nocks
      .elementsFound('#weblogin')
      .text(0, 'first')
      .text(1, 'second');

    let page = Nightwatch.api().page.simplePageObj();

    page
      .getText('@loginIndexed', function callback(result) {
        assert.equal(result.status, 0, 'status for element indexed found');
        assert.equal(result.value, 'second', 'element indexed value');
      })
      .getText({selector:'@loginIndexed', index: 0}, function callback(result) {
        assert.equal(result.status, 0, 'status for element index 0 override found');
        assert.equal(result.value, 'first', 'element index overridde value');
      })
      .getText({selector:'@loginCss', index: 1}, function callback(result) {
        assert.equal(result.status, 0, 'status for element selector index 1 found');
        assert.equal(result.value, 'second', 'element selector index 1 value');
      })
      .getText({selector:'@loginCss', index: 999}, function callback(result) {
        assert.equal(result.status, -1, 'element selector index out of bounds not found');
      });

    Nightwatch.start(done);
  });

  it('using page section elements with index', function (done) {
    nocks
      .elementFound('#signupSection') // page.section
      .elementsId(0, '#helpBtn', [{ELEMENT: '1'},{ELEMENT: '2'}])
      .elementId(0, '#helpBtn', null, {ELEMENT: '1'})
      .text(1, 'help-first')
      .text(2, 'help-second')
      .elementsId(0, '#getStarted', [{ELEMENT: '10'}]) // page.section.section
      .elementId(0, '#getStarted', null, {ELEMENT: '10'})
      .elementsId(10, '#getStartedStart', [{ELEMENT: '11'}]) // page.section.section.element
      .elementId(10, '#getStartedStart', null, {ELEMENT: '11'})
      .text(11, 'start-first');

    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;
    let sectionChild = section.section.getStarted;

    section
      .getText({selector:'@help'}, function callback(result) {
        assert.equal(result.status, 0, 'section element selector found');
        assert.equal(result.value, 'help-first', 'section element selector value');
      })
      .getText({selector:'@help', index: 1}, function callback(result) {
        assert.equal(result.status, 0, 'section element selector index 1 found');
        assert.equal(result.value, 'help-second', 'section element selector index 1 value');
      })
      .getText({selector:'@help', index: 999}, function callback(result) {
        assert.equal(result.status, -1, 'section element selector index out of bounds not found');
      });

    sectionChild
      .getText({selector:'@start'}, function callback(result) {
        assert.equal(result.status, 0, 'child section element selector found');
        assert.equal(result.value, 'start-first', 'child section element selector value');
      })
      .getText({selector:'@start', index: 0}, function callback(result) {
        assert.equal(result.status, 0, 'child section element selector index 0 found');
        assert.equal(result.value, 'start-first', 'child section element selector index 0 value');
      })
      .getText({selector:'@start', index: 999}, function callback(result) {
        assert.equal(result.status, -1, 'child section element selector index out of bounds not found');
      });

    Nightwatch.start(done);
  });

  it('using expect selectors with index - passing assertions', function (done) {
    nocks
      .elementsFound()
      .elementsFound('#signupSection', [{ELEMENT: '0'}])
      .elementsId(0, '#helpBtn', [{ELEMENT: '0'}])
      .elementsByXpath();

    let api = Nightwatch.api();
    api.globals.abortOnAssertionFailure = false;

    let page = api.page.simplePageObj();
    let section = page.section.signUp;

    let passingAssertions = [
      api.expect.element({selector: '.nock', index: 2}).to.be.present.before(1),
      page.expect.section({selector: '@signUp', locateStrategy: 'css selector', index: 0}).to.be.present.before(1),
      section.expect.element({selector: '@help', index: 0}).to.be.present.before(1)
    ];

    api.perform(function() {
      passingAssertions.forEach(function(expect, index) {
        assert.equal(expect.assertion.passed, true, 'passing [' + index + ']: ' + expect.assertion.message);
      });
    });

    Nightwatch.start(done);
  });

  it('using expect selectors with index - failing .nock', function (done) {
    nocks.elementsFound();

    let api = Nightwatch.api();
    api.globals.abortOnAssertionFailure = false;

    let expect = api.expect.element({selector: '.nock', index: 999}).to.be.present.before(1);

    api.perform(function() {
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.includes('element was not found'), -1);
    });

    Nightwatch.start(function(err) {
      done(err || nocks.checkIfMocksDone());
    });
  });

  it('using expect selectors with index - failing @help', function (done) {
    nocks
      .elementsFound('#signupSection', [{ELEMENT: '0'}])
      .elementsId(0, '#helpBtn', [{ELEMENT: '0'}]);

    let api = Nightwatch.api();
    api.globals.abortOnAssertionFailure = false;
    let page = api.page.simplePageObj();
    let section = page.section.signUp;

    let expect = section.expect.element({selector: '@help', index: 999}).to.be.present.before(1);

    api.perform(function() {
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.includes('element was not found'), -1);
    });

    Nightwatch.start(function(err) {
      done(err || nocks.checkIfMocksDone());
    });
  });
});
