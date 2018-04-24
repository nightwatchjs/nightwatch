const path = require('path');
const assert = require('assert');
const nocks = require('../../../lib/nockselements.js');
const MockServer  = require('../../../lib/mockserver.js');
const Nightwatch = require('../../../lib/nightwatch.js');
const utils = require('../../../lib/utils.js');

describe('test protocol element selectors', function() {
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

  it('protocol.element(using, {selector})', function (done) {
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
  });

  it('protocol.element(using, null)', function (done) {
    utils.catchQueueError(function (err) {
      assert.ok(err.message.includes('Invalid selector value specified'));
      done();
    });

    Nightwatch.api()
      .element('css selector', null, function callback(result) {
        assert.ok(false, 'Null selector object should fail');
      });

    Nightwatch.start();
  });

  it('protocol.element(using, {})', function (done) {
    utils.catchQueueError(function (err) {
      assert.ok(err.message.includes('No selector property for'));
      done();
    });

    Nightwatch.api()
      .element('css selector', {}, function callback(result) {
        assert.ok(false, 'Empty selector object should fail');
      });

    Nightwatch.start();
  });

  it('protocol.element(using, {selector, locateStrategy})', function (done) {
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
  });

  it('protocol.element(using, {locateStrategy})', function (done) {
    utils.catchQueueError(function (err) {
      assert.ok(err.message.includes('No selector property for'));
      done();
    });

    Nightwatch.api()
      .element('css selector', {locateStrategy: 'css selector'}, function callback(result) {
        assert.ok(false, 'Selector with just locateStrategy should fail');
      });

    Nightwatch.start();
  });

  it('protocol.element(using, {locateStrategy=invalid})', function (done) {
    utils.catchQueueError(function (err) {
      assert.ok(!err.message.includes('Provided locating strategy is not supported'));
      done();
    });

    Nightwatch.api()
      .element('css selector', {selector: '.nock', locateStrategy: 'unsupported'}, function callback(result) {
        assert.ok(false, 'Selector with invalid locateStrategy should fail');
      });

    Nightwatch.start();
  });

  it('protocol.elements(using, {selector})', function (done) {
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
  });

  it('protocol.elements(using, null)', function (done) {
    utils.catchQueueError(function (err) {
      assert.ok(err.message.includes('Invalid selector value specified'));
      done();
    });

    Nightwatch.api()
      .elements('css selector', null, function callback(result) {
        assert.ok(false, 'Null selector object should fail');
      });

    Nightwatch.start();
  });

  it('protocol.elements(using, {})', function (done) {
    utils.catchQueueError(function (err) {
      assert.ok(err.message.includes('No selector property for'));
      done();
    });

    Nightwatch.api()
      .elements('css selector', {}, function callback(result) {
        assert.ok(false, 'Empty selector object should fail');
      });

    Nightwatch.start();
  });

  it('protocol.elements(using, {selector, locateStrategy})', function (done) {
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
  });

  it('protocol.elements(using, {locateStrategy})', function (done) {
    utils.catchQueueError(function (err) {
      assert.ok(err.message.includes('No selector property for'));
      done();
    });

    Nightwatch.api()
      .elements('css selector', {locateStrategy: 'css selector'}, function callback(result) {
        assert.ok(false, 'Selector with just locateStrategy should fail');
      });

    Nightwatch.start();
  });

  it('protocol.elements(using, {locateStrategy=invalid})', function (done) {
    utils.catchQueueError(function (err) {
      var msg = 'Provided locating strategy is not supported';
      assert.equal(err.message.indexOf(msg), -1);
      done();
    });

    Nightwatch.api()
      .elements('css selector', {selector: '.nock', locateStrategy: 'unsupported'}, function callback(result) {
        assert.ok(false, 'Selector with invalid locateStrategy should fail');
      });

    Nightwatch.start();
  });

});
