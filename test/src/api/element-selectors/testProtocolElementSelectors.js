const path = require('path');
const assert = require('assert');
const nocks = require('../../../lib/nockselements.js');
const MockServer  = require('../../../lib/mockserver.js');
const Nightwatch = require('../../../lib/nightwatch.js');

describe('test protocol element selectors', function() {
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
      });

    Nightwatch.start(done);
  });

  it('protocol.element(using, null)', function (done) {
    Nightwatch.api().element('css selector', null);

    Nightwatch.start(function(err) {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('Invalid selector value specified'));
      done();
    });
  });

  it('protocol.element(using, {})', function (done) {
    Nightwatch.api().element('css selector', {});

    Nightwatch.start(function(err) {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('No selector property for selector object'));
      done();
    });
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
      });

    Nightwatch.start(done);
  });

  it('protocol.element(using, {locateStrategy})', function (done) {
    Nightwatch.api().element('css selector', {locateStrategy: 'css selector'});

    Nightwatch.start(function(err) {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('No selector property for selector object'));
      done();
    });
  });

  it('protocol.element(using, {locateStrategy=invalid})', function (done) {
    Nightwatch.api().element('css selector', {selector: '.nock', locateStrategy: 'unsupported'});

    Nightwatch.start(function(err) {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('Provided locating strategy "unsupported" is not supported'));
      done();
    });
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
      });

    Nightwatch.start(done);
  });

  it('protocol.elements(using, null)', function (done) {
    Nightwatch.api().elements('css selector', null);

    Nightwatch.start(function(err) {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('Invalid selector value specified'));
      done();
    });
  });

  it('protocol.elements(using, {})', function (done) {
    Nightwatch.api().elements('css selector', {});

    Nightwatch.start(function(err) {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('No selector property for selector object'));
      done();
    });
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
      });

    Nightwatch.start(done);
  });

  it('protocol.elements(using, {locateStrategy})', function (done) {
    Nightwatch.api().elements('css selector', {locateStrategy: 'css selector'});

    Nightwatch.start(function(err) {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('No selector property for selector object'));
      done();
    });
  });

  it('protocol.elements(using, {locateStrategy=invalid})', function (done) {
    Nightwatch.api().elements('css selector', {selector: '.nock', locateStrategy: 'unsupported'});

    Nightwatch.start(function(err) {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('Provided locating strategy "unsupported" is not supported'));
      done();
    });
  });

});
