const path = require('path');
const assert = require('assert');
const nocks = require('../../lib/nockselements.js');
const Nightwatch = require('../../lib/nightwatch.js');
const {strictEqual} = assert;

// FIXME:
// TypeError: Cannot read property 'args' of undefined (and Mocha's done() called multiple times)
// at AsyncTree.<anonymous> (test/src/element/testPageObjectElementSelectors.js:233:36)
//   at AsyncTree.done (lib/core/asynctree.js:111:10)
//   at AsyncTree.traverse (lib/core/asynctree.js:47:19)
//   at CommandQueue.traverse (lib/core/queue.js:82:8)
//   at Timeout.scheduleTimeoutId.setTimeout [as _onTimeout] (lib/core/queue.js:59:52)
describe('test page object element selectors', function() {

  before(function() {
    nocks.enable();
  });

  after(function() {
    nocks.disable();
  });

  beforeEach(function(done) {
    nocks.cleanAll().enable().createSession();

    Nightwatch.init({
      page_objects_path: [path.join(__dirname, '../../extra/pageobjects/pages')],
      custom_commands_path: [path.join(__dirname, '../../extra/commands')],
      custom_assertions_path: [path.join(__dirname, '../../extra/assertions')],
      output: false,
      silent: false,
      globals: {
        abortOnAssertionFailure: true
      }
    }, done);
  });

  it('page elements', function(done) {
    nocks
      .elementsFound('#weblogin')
      .elementsFound('weblogin', [{ELEMENT: '0'}], 'id')
      .elementsByXpath('//weblogin')
      .elementsByXpath('#weblogin', [])
      .text(0, 'first')
      .text(1, 'second');

    let page = Nightwatch.api().page.simplePageObj();

    page
      .getText('@loginAsString', function callback(result) {
        strictEqual(result.status, 0, 'element selector string found');
        strictEqual(result.value, 'first', 'element selector string value');
      })
      .getText({selector: '@loginAsString'}, function callback(result) {
        strictEqual(result.status, 0, 'element selector property found');
        strictEqual(result.value, 'first', 'element selector property value');
      })
      .getText('@loginXpath', function callback(result) {
        strictEqual(result.status, 0, 'element selector xpath found');
        strictEqual(result.value, 'first', 'element selector xpath value');
      })
      .getText('@loginCss', function callback(result) {
        strictEqual(result.status, 0, 'element selector css found');
        strictEqual(result.value, 'first', 'element selector css value');
      })
      .getText('@loginId', function callback(result) {
        strictEqual(result.status, 0, 'element selector id found');
        strictEqual(result.value, 'first', 'element selector id value');
      });

    Nightwatch.start(done);
  });

  it('page section elements', function(done) {
    nocks
      .elementsFound('#signupSection')
      .elementsFound('#getStarted')
      .elementsFound('#helpBtn')
      .elementIdNotFound(0, '#helpBtn', 'xpath')
      .elementsId('0', '#helpBtn', [{ELEMENT: '0'}])
      .text(0, 'first')
      .text(1, 'second');

    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;
    let sectionChild = section.section.getStarted;

    section
      .getText('@help', function callback(result) {
        strictEqual(result.status, 0, 'section element selector string found');
        strictEqual(result.value, 'first', 'section element selector string value');
      })
      .getText({selector: '@help'}, function callback(result) {
        strictEqual(result.status, 0, 'section element selector property found');
        strictEqual(result.value, 'first', 'section element selector property value');
      });

    assert.throws(function() {
      section.getText({selector: '@help', locateStrategy: 'xpath'});
    }, /^Error: Element "help\[locateStrategy='xpath'\]" was not found in "signUp"/);

    sectionChild
      .getText('#helpBtn', function callback(result) {
        strictEqual(result.status, 0, 'child section element selector string found');
        strictEqual(result.value, 'first', 'child section element selector string value');
      })
      .getText({selector: '#helpBtn'}, function callback(result) {
        strictEqual(result.status, 0, 'child section element selector property found');
        strictEqual(result.value, 'first', 'child section element selector property value');
      });

    Nightwatch.start(done);
  });

  it('page section elements', function(done) {
    nocks
      .elementsFound('#signupSection')
      .elementsFound('#getStarted')
      .elementsFound('#helpBtn')
      .elementIdNotFound(0, '#helpBtn', 'xpath')
      .elementsId('0', '#helpBtn', [{ELEMENT: '0'}])
      .text(0, 'first')
      .text(1, 'second');

    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;
    let sectionChild = section.section.getStarted;

    section
      .getText('@help', function callback(result) {
        strictEqual(result.status, 0, 'section element selector string found');
        strictEqual(result.value, 'first', 'section element selector string value');
      })
      .getText({selector: '@help'}, function callback(result) {
        strictEqual(result.status, 0, 'section element selector property found');
        strictEqual(result.value, 'first', 'section element selector property value');
      });

    assert.throws(function() {
      section.getText({selector: '@help', locateStrategy: 'xpath'});
    }, /^Error: Element "help\[locateStrategy='xpath'\]" was not found in "signUp"/);

    sectionChild
      .getText('#helpBtn', function callback(result) {
        strictEqual(result.status, 0, 'child section element selector string found');
        strictEqual(result.value, 'first', 'child section element selector string value');
      })
      .getText({selector: '#helpBtn'}, function callback(result) {
        strictEqual(result.status, 0, 'child section element selector property found');
        strictEqual(result.value, 'first', 'child section element selector property value');
      });

    Nightwatch.start(done);
  });

  it('page section protocol .elements()', function(done) {
    nocks
      .elementsFound('#signupSection')
      .elementsId('0', '#helpBtn', [{ELEMENT: '12345'}]);

    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;

    section.api.elements('@help', function callback(response) {
      strictEqual(response.status, 0, 'section element selector string found');
      strictEqual(response.result.value.length, 1);
      strictEqual(response.value, '12345');
    });

    Nightwatch.start(done);
  });

  it('page section elements with css selectors', function(done) {
    nocks
      .elementsFound('#signupSection')
      .elementsNotFound('#helpBtn')
      .elementsId('0', '#helpBtn', [{ELEMENT: '0'}])
      .text(0, 'first');

    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;

    section
      .getText({selector: '#helpBtn', timeout: 100, retryInterval: 50}, function callback(result) {
        strictEqual(result.status, 0);
        strictEqual(result.value, 'first');
      })
      .getText({selector: '@help', timeout: 100, retryInterval: 50}, function callback(result) {
        strictEqual(result.status, 0);
        strictEqual(result.value, 'first');
      });

    section.expect.elements({
      selector: '#helpBtn',
      timeout: 100,
      retryInterval: 50,
      abortOnFailure: true
    }).count.equal(1);

    Nightwatch.start(done);
  });

  it('page section protocol .element()', function(done) {
    nocks
      .elementsFound('#signupSection')
      .elementId('0', '#helpBtn', 'css selector', {ELEMENT: '12345'});

    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;

    section.api.element('#helpBtn', function callback(response) {
      strictEqual(response.status, 0, 'section element selector string found');
      strictEqual(response.result.value.ELEMENT, '12345');
      strictEqual(response.value, '12345');
    });

    Nightwatch.start(done);
  });

  it('page section protocol .elementIdElements()', function(done) {
    nocks
      .elementsFound('#signupSection')
      .elementsId('0', '#helpBtn', {ELEMENT: '12345'})
      .elementsId('12345', 'a', [{ELEMENT: 'abc-12345'}]);

    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;

    section.api.elementIdElements('@help', 'css selector', 'a', function callback(response) {
      strictEqual(response.status, 0, 'section element selector string found');
      strictEqual(response.value[0].ELEMENT, 'abc-12345');
    });

    Nightwatch.start(done);
  });

  it('page section protocol .elementIdElement()', function(done) {
    nocks
      .elementsFound('#signupSection')
      .elementsId('0', '#helpBtn', [{ELEMENT: '12345'}])
      .elementId('12345', 'a', 'css selector', {ELEMENT: 'abc-12345'})

    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;

    section.api.elementIdElement('@help', 'css selector', 'a', function callback(response) {
      strictEqual(response.status, 0, 'section element selector string found');
      strictEqual(response.value.ELEMENT, 'abc-12345');
    });

    Nightwatch.start(done);
  });

  it('page section elements - section element not found', function() {
    nocks
      .elementsNotFound('#signupSection')
      .elementsFound('#weblogin')
      .elementFound('#weblogin')
      .clearValue('0')
      .elementsId('0', '#getStartedStart', [{ELEMENT: '1'}])
      .text(0, 'first')
      .text(1, 'second');

    Nightwatch.api().globals.waitForConditionPollInterval = 10;

    let page = Nightwatch.api().page.simplePageObj();
    page.testCommand();
    let section = page.section.signUp;

    let expect = section.expect.element('@help').to.be.visible.before(15);

    return Nightwatch.start(function(err) {
      assert.ok(err instanceof Error, 'Expected err to be an Error but found: ' + typeof err);
      strictEqual(err.name, 'NightwatchAssertError');
      strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.includes('Expected element <Section [name=signUp],Element [name=@help]> to be visible'));
      assert.ok(expect.assertion.message.includes('element was not found'));
    });
  });

  it('page object customCommand with selector', function(done) {
    nocks
      .elementFound('#signupSection')
      .elementFound('#getStarted')
      .elementFound('#helpBtn')
      .elementIdNotFound(0, '#helpBtn', 'xpath')
      .elementsId('0', '#helpBtn', [{ELEMENT: '0'}]);

    const page = Nightwatch.api().page.simplePageObj();
    page.customCommandWithSelector('@loginAsString', function(result) {
      assert.deepEqual(result, {
        selector: '#weblogin',
        locateStrategy: 'css selector',
        name: 'loginAsString'
      });
    });

    Nightwatch.start(function() {
      done();
    });
  });

  it('page object element command with custom message and no args', function(done) {
    nocks.elementsFound('#weblogin');

    const page = Nightwatch.api().page.simplePageObj();
    page.waitForElementPresent('@loginAsString', 'element found');

    const client = Nightwatch.client();
    client.session.commandQueue.tree.on('asynctree:finished', function(tree) {
      const command = tree.currentNode.childNodes[0];
      try {
        strictEqual(command.args.length, 2);
        const element = command.args[0];
        strictEqual(element.name, 'loginAsString');
        strictEqual(command.args[1], 'element found');
        done();
      } catch (e) {
        done(e);
      }
    });

    Nightwatch.start();
  });

  it('page object customCommand with selector called on section', function(done) {
    nocks
      .elementsFound('#signupSection')
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
          strictEqual(this.opts.rescheduleInterval, 50);
          strictEqual(this.opts.timeout, 100);
          strictEqual(result, true);
          strictEqual(assertion.element.selector, '#weblogin');
          strictEqual(assertion.element.locateStrategy, 'css selector');
          strictEqual(assertion.element.name, 'loginAsString');

        } catch (err) {
          done(err);
        }
      })
      .assert.customAssertionWithSelector('@loginAsString', 1, function(result, assertion) {
        try {
          assert.ok(result instanceof Error);
          assert.ok(result.message.includes('in 100ms'));
          strictEqual(assertion.rescheduleInterval, 50);
          strictEqual(assertion.retryAssertionTimeout, 100);
          strictEqual(assertion.element.selector, '#weblogin');
          strictEqual(assertion.element.locateStrategy, 'css selector');
          strictEqual(assertion.element.name, 'loginAsString');
          done();
        } catch (err) {
          done(err);
        }
      });

    Nightwatch.start();
  });

  it('page object customAssertion with selector called on section', function(done) {
    nocks
      .elementsFound('#signupSection')
      .elementFound('#getStarted')
      .elementFound('#helpBtn')
      .elementsId('0', '#helpBtn', [{ELEMENT: '0'}]);

    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;

    section.assert.customAssertionWithSelector('@help', 0, function(result, assertion) {
      try {
        strictEqual(result, true);
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
      .elementsFound('#signupSection') // page.section
      .elementsId(0, '#helpBtn', [{ELEMENT: '1'},{ELEMENT: '2'}])
      .elementId(0, '#helpBtn', null, {ELEMENT: '1'});

    let page = Nightwatch.api().page.simplePageObj();
    let section = page.section.signUp;

    section.assert.customAssertionWithSelector({selector:'@help', index: 1}, 0, function(result, assertion) {
      try {
        strictEqual(result, true);
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

  it('nested folder page object is loaded properly', function() {
    let fooPage = Nightwatch.api().page.api.method.foo();
    let fooSection = fooPage.section.foo;
    strictEqual(fooSection.name, 'foo');

    let barPage = Nightwatch.api().page.api.method.bar();
    let barSection = barPage.section.bar;
    strictEqual(barSection.name, 'bar');
  });

});
