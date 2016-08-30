var nock = require('nock');
var path = require('path');
var assert = require('assert');
var MochaTest = require('../../../lib/mochatest.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var common = require('../../../common.js');
var Api = common.require('core/api.js');

module.exports = MochaTest.add('test element selectors', {

  beforeEach: function (done) {
    Nightwatch.init({
      page_objects_path: [path.join(__dirname, '../../../extra/pageobjects')]
    }, done);
  },

  afterEach: function () {
    nock.cleanAll();
  },


  'protocol.element(using, {selector})' : function(done) {
    nocks
      .elementFound()
      .elementNotFound();

    Nightwatch.api()
      .element('css selector', '#nock', function callback(result) {
        assert.equal(result.value.ELEMENT, '0', 'Found element for string selector');
      })
      .element('css selector', '#nock-none', function callback(result) {
        assert.equal(result.status, -1, 'Not found for string selector');
      })
      .element('css selector', {selector: '#nock'}, function callback(result) {
        assert.equal(result.value.ELEMENT, '0', 'Found element for selector property');
      })
      .element('css selector', {selector: '#nock-none'}, function callback(result) {
        assert.equal(result.status, -1, 'Not found for selector property');
      })
      .perform(function() {
        done(); // done here, not in start(), to make sure all commands complete without error
      });

    Nightwatch.start();
  },

  'protocol.element(using, null)' : function(done) {
    catchQueueError(function (err) {
      var msg = 'Invalid selector value specified';
      assert.equal(err.message, msg);
      done();
    });

    Nightwatch.api()
      .element('css selector', null, function callback(result) {
        assert.ok(false, 'Null selector object should fail');
      });

    Nightwatch.start();
  },

  'protocol.element(using, {})' : function(done) {
    catchQueueError(function (err) {
      var msg = 'No selector property for element'; // ... rest of error, etc.
      assert.equal(err.message.slice(0, msg.length), msg);
      done();
    });

    Nightwatch.api()
      .element('css selector', {}, function callback(result) {
        assert.ok(false, 'Empty selector object should fail');
      });

    Nightwatch.start();
  },

  'protocol.element(using, {selector, locateStrategy})' : function(done) {
    nocks.elementFound();

    Nightwatch.api()
      .element('css selector', {selector: '#nock', locateStrategy: 'css selector'}, function callback(result) {
        assert.equal(result.value.ELEMENT, '0', 'Found element, same locateStrategy');
      })
      .element('xpath', {selector: '#nock', locateStrategy: 'css selector'}, function callback(result) {
        assert.equal(result.value.ELEMENT, '0', 'Found element, overridden locateStrategy');
      })
      .element('css selector', {selector: '#nock', locateStrategy: null}, function callback(result) {
        assert.equal(result.value.ELEMENT, '0', 'Found element, null locateStrategy');
      })
      .perform(function() {
        done();
      });

    Nightwatch.start();
  },

  'protocol.element(using, {locateStrategy})' : function(done) {
    catchQueueError(function (err) {
      var msg = 'No selector property for element';
      assert.equal(err.message.slice(0, msg.length), msg);
      done();
    });

    Nightwatch.api()
      .element('css selector', {locateStrategy: 'css selector'}, function callback(result) {
        assert.ok(false, 'Selector with just locateStrategy should fail');
      });

    Nightwatch.start();
  },

  'protocol.element(using, {locateStrategy=invalid})' : function(done) {
    catchQueueError(function (err) {
      var msg = 'Provided locating strategy is not supported';
      assert.equal(err.message.slice(0, msg.length), msg);
      done();
    });

    Nightwatch.api()
      .element('css selector', {selector: '.nock', locateStrategy: 'unsupported'}, function callback(result) {
        assert.ok(false, 'Selector with invalid locateStrategy should fail');
      });

    Nightwatch.start();
  },

  'protocol.element(using, {selector, index})' : function(done) {
    nocks.elementFound();

    Nightwatch.api()
      .element('css selector', {selector: '#nock', index: 0}, function callback(result) {
        assert.equal(result.value.ELEMENT, '0', 'Found element, 0 index ignored');
      })
      .element('css selector', {selector: '#nock', index: 1}, function callback(result) {
        assert.equal(result.value.ELEMENT, '0', 'Found element, 1 index ignored');
      })
      .perform(function() {
        done();
      });

    Nightwatch.start();
  },

  'protocol.elements(using, {selector})' : function(done) {
    nocks
      .elementsFound()
      .elementsNotFound();

    Nightwatch.api()
      .elements('css selector', '.nock', function callback(result) {
        assert.equal(result.value[0].ELEMENT, '0', 'Found elements for string selector');
      })
      .elements('css selector', '.nock-none', function callback(result) {
        assert.equal(result.status, 0, 'No error for string selector');
        assert.equal(result.value.length, 0, 'No results for string selector');
      })
      .elements('css selector', {selector: '.nock'}, function callback(result) {
        assert.equal(result.value[0].ELEMENT, '0', 'Found elements for selector property');
      })
      .elements('css selector', {selector: '.nock-none'}, function callback(result) {
        assert.equal(result.status, 0, 'Not found for selector property');
        assert.equal(result.value.length, 0, 'No results for selector property');
      })
      .perform(function() {
        done();
      });

    Nightwatch.start();
  },

  'protocol.elements(using, null)' : function(done) {
    catchQueueError(function (err) {
      var msg = 'Invalid selector value specified';
      assert.equal(err.message, msg);
      done();
    });

    Nightwatch.api()
      .elements('css selector', null, function callback(result) {
        assert.ok(false, 'Null selector object should fail');
      });

    Nightwatch.start();
  },

  'protocol.elements(using, {})' : function(done) {
    catchQueueError(function (err) {
      var msg = 'No selector property for element';
      assert.equal(err.message.slice(0, msg.length), msg);
      done();
    });

    Nightwatch.api()
      .elements('css selector', {}, function callback(result) {
        assert.ok(false, 'Empty selector object should fail');
      });

    Nightwatch.start();
  },

  'protocol.elements(using, {selector, locateStrategy})' : function(done) {
    nocks
      .elementsFound()
      .elementsByTag();

    Nightwatch.api()
      .elements('css selector', {selector: '.nock', locateStrategy: 'css selector'}, function callback(result) {
        assert.equal(result.value[0].ELEMENT, '0', 'Found element, same locateStrategy');
      })
      .elements('xpath', {selector: '.nock', locateStrategy: 'css selector'}, function callback(result) {
        assert.equal(result.value[0].ELEMENT, '0', 'Found element, overridden locateStrategy');
      })
      .elements('xpath', {selector: 'nock', locateStrategy: 'tag name'}, function callback(result) {
        assert.equal(result.value[0].ELEMENT, '0', 'Found element, by tag name');
      })
      .elements('css selector', {selector: '.nock', locateStrategy: null}, function callback(result) {
        assert.equal(result.value[0].ELEMENT, '0', 'Found element, null locateStrategy');
      })
      .perform(function() {
        done();
      });

    Nightwatch.start();
  },

  'protocol.elements(using, {locateStrategy})' : function(done) {
    catchQueueError(function (err) {
      var msg = 'No selector property for element';
      assert.equal(err.message.slice(0, msg.length), msg);
      done();
    });

    Nightwatch.api()
      .elements('css selector', {locateStrategy: 'css selector'}, function callback(result) {
        assert.ok(false, 'Selector with just locateStrategy should fail');
      });

    Nightwatch.start();
  },

  'protocol.elements(using, {locateStrategy=invalid})' : function(done) {
    catchQueueError(function (err) {
      var msg = 'Provided locating strategy is not supported';
      assert.equal(err.message.slice(0, msg.length), msg);
      done();
    });

    Nightwatch.api()
      .elements('css selector', {selector: '.nock', locateStrategy: 'unsupported'}, function callback(result) {
        assert.ok(false, 'Selector with invalid locateStrategy should fail');
      });

    Nightwatch.start();
  },

  'protocol.elements(using, {selector, index})' : function(done) {
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
        assert.equal(result.value.length, 3, 'Out of range index, keep elements query result');
        assert.equal(result.status, -1, 'Not found for out of range index');
      })
      .perform(function() {
        done();
      });

    Nightwatch.start();
  },

  // wrapped selenium command

  'getText(<various>)' : function(done) {
    nocks
      .elementsFound()
      .elementsNotFound()
      .elementsByXpath()
      .text(0, 'first')
      .text(1, 'second');

    Nightwatch.api()
      .getText('.nock', function callback(result) {
        assert.equal(result.value, 'first', 'getText string selector value');
      })
      .getText({selector: '.nock'}, function callback(result) {
        assert.equal(result.value, 'first', 'getText selector property');
      })
      .getText({selector: '.nock-none'}, function callback(result) {
        assert.equal(result.status, -1, 'getText not found status');
        assert.equal(result.value.length, 0, 'No results for getText selector');
      })
      .getText({selector: '.nock', index: 1}, function callback(result) {
        assert.equal(result.value, 'second', 'getText index 1');
      })
      .getText({selector: '//[@class="nock"]', locateStrategy: 'xpath'}, function callback(result) {
        assert.equal(result.value, 'first', 'getText xpath locateStrategy');
      })
      .getText({selector: '//[@class="nock"]', locateStrategy: 'xpath', index: 1}, function callback(result) {
        assert.equal(result.value, 'second', 'getText xpath locateStrategy index 1');
      })
      .getText({selector: '//[@class="nock"]', locateStrategy: 'xpath', index: 999}, function callback(result) {
        assert.equal(result.status, -1, 'getText xpath locateStrategy out of range index');
      })
      .perform(function() {
        done();
      });

    Nightwatch.start();
  },

  'getText(<various>) locateStrategy' : function(done) {
    nocks
      .elementsFound()
      .elementsNotFound()
      .elementsByXpath()
      .text(0, 'first')
      .text(1, 'second');

    Nightwatch.api()
      .useCss()
      .getText('.nock', function callback(result) {
        assert.equal(result.value, 'first', 'getText string selector useCss');
      })
      .useXpath()
      .getText('//[@class="nock"]', function callback(result) {
        assert.equal(result.value, 'first', 'getText string selector useXpath');
      })
      .useCss()
      .getText({selector: '//[@class="nock"]', locateStrategy: 'xpath'}, function callback(result) {
        assert.equal(result.value, 'first', 'getText useCss override with xpath');
      })
      .getText('.nock', function callback(result) {
        assert.equal(result.value, 'first', 'getText back to css after override with xpath');
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
      .waitForElementPresent({selector: '.nock', index: 1}, 1, false, function callback(result) {
        assert.equal(result.value.length, 1, 'waitforPresent index has results');
        assert.equal(result.value[0].ELEMENT, '1', 'waitforPresent found element 1');
      })
      .waitForElementPresent({selector: '.nock', index: 999}, 1, false, function callback(result) {
        assert.equal(result.value, false, 'waitforPresent out of bounds index expected false');
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
      .waitForElementPresent({selector: '.nock', index: 1}, 1, false, function callback(result) {
        assert.equal(result.value.length, 1, 'waitforPresent back to css index has results');
        assert.equal(result.value[0].ELEMENT, '1', 'waitforPresent found element 1');
      })
      .perform(function() {
        done();
      });

    Nightwatch.start();
  },

  'page elements' : function(done) {
    nocks
      .elementsFound('#weblogin')
      .elementsByXpath('//weblogin')
      .elementsByXpath('#weblogin', [])
      .text(0, 'first')
      .text(1, 'second');

    var client = Nightwatch.client();
    Api.init(client);

    var page = client.api.page.simplePageObj();

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
      .getText('@loginIndexed', function callback(result) {
        assert.equal(result.status, 0, 'element indexed found');
        assert.equal(result.value, 'second', 'element indexed value');
      })
      .getText({selector:'@loginIndexed', index:0}, function callback(result) {
        assert.equal(result.status, 0, 'element indexed overridden found');
        assert.equal(result.value, 'first', 'element indexed overridden value');
      })
      .getText({selector:'@loginCss', locateStrategy:'xpath'}, function callback(result) {
        assert.equal(result.status, -1, 'element selector css xpath override not found');
      })
      .getText({selector:'@loginCss', index: 1}, function callback(result) {
        assert.equal(result.status, 0, 'element selector index 1 found');
        assert.equal(result.value, 'second', 'element selector index 1 value');
      })
      .getText({selector:'@loginCss', index: 999}, function callback(result) {
        assert.equal(result.status, -1, 'element selector index out of bounds not found');
      })
      .api.perform(function() {
        done();
      });

    Nightwatch.start();
  },

  'page section elements' : function(done) {
    nocks
      .elementsFound('#signupSection', [{ELEMENT: '0'}])
      .elementsFound('#getStarted', [{ELEMENT: '0'}])
      .elementsFound('#helpBtn')
      .elementsId(0, '#helpBtn', [], 'xpath')
      .elementsId(0, '#helpBtn')
      .text(0, 'first')
      .text(1, 'second');

    var client = Nightwatch.client();
    Api.init(client);

    var page = client.api.page.simplePageObj();
    var section = page.section.signUp;
    var sectionChild = section.section.getStarted;

    section
      .getText('@help', function callback(result) {
        assert.equal(result.status, 0, 'section element selector string found');
        assert.equal(result.value, 'first', 'section element selector string value');
      })
      .getText({selector: '@help'}, function callback(result) {
        assert.equal(result.status, 0, 'section element selector property found');
        assert.equal(result.value, 'first', 'section element selector property value');
      })
      .getText({selector:'@help', locateStrategy:'xpath'}, function callback(result) {
        assert.equal(result.status, -1, 'section element selector css xpath override not found');
      })
      .getText({selector:'@help', index: 1}, function callback(result) {
        assert.equal(result.status, 0, 'section element selector index 1 found');
        assert.equal(result.value, 'second', 'section element selector index 1 value');
      })
      .getText({selector:'@help', index: 999}, function callback(result) {
        assert.equal(result.status, -1, 'section element selector index out of bounds not found');
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
      .getText({selector:'#helpBtn', index: 1}, function callback(result) {
        assert.equal(result.status, 0, 'child section element selector index 1 found');
        assert.equal(result.value, 'second', 'child section element selector index 1 value');
      })
      .api.perform(function() {
        done();
      });

    Nightwatch.start();
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
      api.expect.element({selector: '.nock', index: 2}).to.be.present.before(1),
      page.expect.section('@signUp').to.be.present.before(1),
      page.expect.section({selector: '@signUp', locateStrategy: 'css selector'}).to.be.present.before(1),
      section.expect.element('@help').to.be.present.before(1),
      section.expect.element({selector: '@help', index: 0}).to.be.present.before(1)
    ];

    var fails = [
      [api.expect.element({selector: '.nock', locateStrategy: 'xpath'}).to.be.present.before(1),
        'element was not found'],
      [api.expect.element({selector: '.nock', index: 999}).to.be.present.before(1),
        'element was not found'],
      [page.expect.section({selector: '@signUp', locateStrategy: 'xpath'}).to.be.present.before(1),
        'element was not found'],
      [section.expect.element({selector: '@help', index: 999}).to.be.present.before(1),
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

// internal nocks mappings (disambiguation between element/elements)

var nocks = {

  _requestUri: 'http://localhost:10195',
  _protocolUri: '/wd/hub/session/1352110219202/',

  elementFound : function(selector) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element', {'using':'css selector','value':selector || '#nock'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: { ELEMENT: '0' }
      });
    return this;
  },

  elementNotFound : function(selector) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element', {'using':'css selector','value':selector || '#nock-none'})
      .reply(200, {
        status: -1,
        value: {},
        errorStatus: 7,
        error: 'An element could not be located on the page using the given search parameters.'
      });
    return this;
  },

  elementsFound : function(selector, foundArray) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'elements', {'using':'css selector','value':selector || '.nock'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundArray || [ { ELEMENT: '0' }, { ELEMENT: '1' }, { ELEMENT: '2' } ]
      });
    return this;
  },

  elementsNotFound : function(selector) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'elements', {'using':'css selector','value':selector || '.nock-none'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: []
      });
    return this;
  },

  elementsByTag : function(selector, foundArray) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'elements', {'using':'tag name','value':selector || 'nock'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundArray || [ { ELEMENT: '0' }, { ELEMENT: '1' }, { ELEMENT: '2' } ]
      });
    return this;
  },

  elementsByXpath : function(selector, foundArray) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'elements', {'using':'xpath','value':selector || '//[@class="nock"]'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundArray || [ { ELEMENT: '0' }, { ELEMENT: '1' }, { ELEMENT: '2' } ]
      });
    return this;
  },

  elementsId : function (id, selector, foundArray, using) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element/' + (id || 0) + '/elements',
        {'using':using || 'css selector','value':selector || '.nock'})
      .reply(200, {
        status: 0,
        state : 'success',
        value: foundArray || [ { ELEMENT: '0' }, { ELEMENT: '1' }, { ELEMENT: '2' } ]
      });
    return this;
  },

  text : function (id, value) {
    nock(this._requestUri)
      .persist()
      .get(this._protocolUri + 'element/' + (id || 0) + '/text')
      .reply(200, {
        status: 0,
        state : 'success',
        value: value || 'textValue'
      });
    return this;
  }
};

/**
 * Monkey-patch run queue run() callbacks to capture errors handled
 * in the queue after they are sent off to the nightwatch instance.
 *
 * @param {function} testCallback The callback used by the test to
 * capture the error object
 */
function catchQueueError(testCallback) {
  var queue = Nightwatch.client().queue;

  // queue is a singleton, not re-instancing with new nightwatch
  // instances. In order to re-patch it if patched previously, we
  // restore the original run method from the patch if it exists
  // (which may happen if a patched run never gets called with err)

  if (queue.run.origRun) {
    queue.run = queue.run.origRun;
  }

  function queueRunnerPatched (origCallback) {
    origRun.call(queue, function(err) {
      origCallback(err);
      if (err) {
        queue.run = origRun; // once, since errors are fatal to queue execution
        testCallback(err);
      }
    });
  }

  var origRun = queueRunnerPatched.origRun = queue.run;
  queue.run = queueRunnerPatched;
}
