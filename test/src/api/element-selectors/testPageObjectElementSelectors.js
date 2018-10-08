const path = require('path');
const assert = require('assert');
const nocks = require('../../../lib/nockselements.js');
const MockServer = require('../../../lib/mockserver.js');
const Nightwatch = require('../../../lib/nightwatch.js');

describe('test page object element selectors', function() {
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

  beforeEach(function(done) {
    nocks.cleanAll();
    Nightwatch.init({
      page_objects_path: [path.join(__dirname, '../../../extra/pageobjects')],
      custom_commands_path: [path.join(__dirname, '../../../extra/commands')],
      custom_assertions_path: [path.join(__dirname, '../../../extra/assertions')],
    }, done);
  });

  it('page elements', function(done) {
    nocks
      .elementFound('#weblogin')
      .elementFound('weblogin', 'id')
      .elementByXpath('//weblogin')
      .elementByXpath('#weblogin', [])
      .text(0, 'first')
      .text(1, 'second');

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
      });

    Nightwatch.start(done);
  });

  it('page section elements', function(done) {
    nocks
      .elementFound('#signupSection')
      .elementFound('#getStarted')
      .elementFound('#helpBtn')
      .elementIdNotFound(0, '#helpBtn', 'xpath')
      .elementsId('0', '#helpBtn', [{ELEMENT: '0'}])
      .text(0, 'first')
      .text(1, 'second');

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
      });

    assert.throws(function() {
      section.getText({selector: '@help', locateStrategy: 'xpath'});
    }, /^Error: Element "help\[locateStrategy='xpath'\]" was not found in "signUp"/);

    sectionChild
      .getText('#helpBtn', function callback(result) {
        assert.equal(result.status, 0, 'child section element selector string found');
        assert.equal(result.value, 'first', 'child section element selector string value');
      })
      .getText({selector: '#helpBtn'}, function callback(result) {
        assert.equal(result.status, 0, 'child section element selector property found');
        assert.equal(result.value, 'first', 'child section element selector property value');
      });

    Nightwatch.start(done);
  });

  it('page section elements - section element not found', function(done) {
    nocks
      .elementsNotFound('#signupSection')
      .elementsId('0', '#getStartedStart', [{ELEMENT: '1'}])
      .text(0, 'first')
      .text(1, 'second');

    Nightwatch.api().globals.abortOnAssertionFailure = false;
    Nightwatch.api().globals.waitForConditionPollInterval = 10;

    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;

    let expect = section.expect.element('@help').to.be.visible.before(15);

    Nightwatch.api().perform(function() {
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.includes('Expected element <Section [name=signUp],Element [name=@help]> to be visible'));
      assert.ok(expect.assertion.message.includes('element was not found'));
    });

    Nightwatch.start(done);
  });

  it('page object customCommand with selector', function(done) {
    nocks
      .elementFound('#signupSection')
      .elementFound('#getStarted')
      .elementFound('#helpBtn')
      .elementIdNotFound(0, '#helpBtn', 'xpath')
      .elementsId('0', '#helpBtn', [{ELEMENT: '0'}]);

    let page = Nightwatch.api().page.simplePageObj();

    page
      .customCommandWithSelector('@loginAsString', function(result) {
        assert.deepEqual(result, {
          selector: '#weblogin',
          locateStrategy: 'css selector',
          name: 'loginAsString'
        });
      });

    Nightwatch.start(done);
  });

  it('page object customCommand with selector called on section', function(done) {
    nocks
      .elementFound('#signupSection')
      .elementFound('#getStarted')
      .elementFound('#helpBtn')
      .elementsId('0', '#helpBtn', [{ELEMENT: '0'}]);

    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;

    section
      .customCommandWithSelector('@help', function(result) {
        assert.deepEqual(result, {
          selector: '#helpBtn',
          locateStrategy: 'css selector',
          name: 'help',
          response: {status: 0, value: '0'}
        });
      });

    Nightwatch.start(done);
  });

  it('page object customAssertion with selector', function(done) {
    nocks
      .elementFound('#signupSection')
      .elementFound('#getStarted')
      .elementFound('#helpBtn')
      .elementIdNotFound(0, '#helpBtn', 'xpath')
      .elementsId('0', '#helpBtn', [{ELEMENT: '0'}]);

    let page = Nightwatch.api().page.simplePageObj();

    page
      .assert.customAssertionWithSelector('@loginAsString', 0, function(result, assertion) {
        try {
          assert.strictEqual(result, true);
          assert.deepEqual(assertion.element, {
            selector: '#weblogin',
            locateStrategy: 'css selector',
            name: 'loginAsString'
          });
        } catch (err) {
          done(err);
        }
      })
      .assert.customAssertionWithSelector('@loginAsString', 1, function(result, assertion) {
        try {
          assert.ok(result instanceof Error);
          assert.ok(result.message.includes('in 100 ms'));
          assert.equal(assertion.rescheduleInterval, 50);
          assert.equal(assertion.retryAssertionTimeout, 100);
          assert.deepEqual(assertion.element, {
            selector: '#weblogin',
            locateStrategy: 'css selector',
            name: 'loginAsString'
          });

          done();
        } catch (err) {
          done(err);
        }
      });

    Nightwatch.start();
  });

  it('page object customAssertion with selector called on section', function(done) {
    nocks
      .elementFound('#signupSection')
      .elementFound('#getStarted')
      .elementFound('#helpBtn')
      .elementsId('0', '#helpBtn', [{ELEMENT: '0'}]);

    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;

    section.assert.customAssertionWithSelector('@help', 0, function(result, assertion) {
      try {
        assert.strictEqual(result, true);
        assert.deepEqual(assertion.element, {
          selector: '#helpBtn',
          locateStrategy: 'css selector',
          name: 'help',
          response: {
            status: 0, value: '0'
          }
        });
        done();
      } catch (err) {
        done(err);
      }
    });

    Nightwatch.start();
  });

  it('page object customAssertion with indexed element called on section', function(done) {
    nocks
      .elementFound('#signupSection') // page.section
      .elementsId(0, '#helpBtn', [{ELEMENT: '1'},{ELEMENT: '2'}])
      .elementId(0, '#helpBtn', null, {ELEMENT: '1'});

    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;

    section.assert.customAssertionWithSelector({selector:'@help', index: 1}, 0, function(result, assertion) {
      try {
        assert.strictEqual(result, true);
        assert.deepEqual(assertion.element, {
          selector: '#helpBtn',
          locateStrategy: 'css selector',
          name: 'help',
          index: 1,
          response: {status: 0, value: '2'}
        });
        done();
      } catch (err) {
        done(err);
      }
    });

    Nightwatch.start();
  });

});
