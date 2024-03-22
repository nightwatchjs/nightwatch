const path = require('path');
const assert = require('assert');
const nocks = require('../../lib/nockselements.js');
const Nightwatch = require('../../lib/nightwatch.js');

describe('test protocol element selectors', function() {
  before(function(done) {
    nocks.enable();
    Nightwatch.startMockServer(done);
  });

  after(function(done) {
    nocks.disable();
    Nightwatch.stop(done);
  });

  beforeEach(function () {
    nocks.cleanAll();

    return Nightwatch.initAsync({
      page_objects_path: [path.join(__dirname, '../../extra/pageobjects/pages')],
      globals: {
        abortOnAssertionFailure: true
      },
      backwards_compatibility_mode: true,
      output: false,
      silent: false
    });
  });

  it('protocol.element(using, {selector})', function () {
    nocks
      .elementFound()
      .elementNotFound();

    Nightwatch.api()
      .element('css selector', '#nock', function callback(result) {
        assert.strictEqual(result.value.ELEMENT, '0');
      })
      .element('css selector', '#nock-none', function callback(result) {
        assert.strictEqual(result.status, -1);
      })
      .element('css selector', {selector: '#nock'}, function callback(result) {
        assert.strictEqual(result.value.ELEMENT, '0');
      })
      .element('css selector', {selector: '#nock-none'}, function callback(result) {
        assert.strictEqual(result.status, -1);
      });

    return Nightwatch.start();
  });

  it('protocol.element(using, null)', async function () {
    Nightwatch.api().element('css selector', null);

    let thrown;

    try {
      await Nightwatch.start();
    } catch (err) {
      thrown = err;
    }

    assert.ok(thrown instanceof Error);
    assert.ok(thrown.message.includes('Invalid selector value specified'));
  });

  it('protocol.element(using, {})', async function () {
    Nightwatch.api().element('css selector', {});

    let thrown;

    try {
      await Nightwatch.start();
    } catch (err) {
      thrown = err;
    }

    assert.ok(thrown instanceof Error);
    assert.ok(thrown.message.includes('No selector property for selector object'));
  });

  it('protocol.element(using, {selector, locateStrategy})', function () {
    nocks.elementFound();

    Nightwatch.api()
      .element('css selector', {selector: '#nock', locateStrategy: 'css selector'}, function callback(result) {
        assert.strictEqual(result.value.ELEMENT, '0');
      })
      .element('xpath', {selector: '#nock', locateStrategy: 'css selector'}, function callback(result) {
        assert.strictEqual(result.value.ELEMENT, '0');
      })
      .element('css selector', {selector: '#nock', locateStrategy: null}, function callback(result) {
        assert.strictEqual(result.value.ELEMENT, '0');
      });

    return Nightwatch.start();
  });

  it('protocol.element(using, {locateStrategy})', async function () {
    Nightwatch.api().element('css selector', {locateStrategy: 'css selector'});

    let thrown;

    try {
      await Nightwatch.start();
    } catch (err) {
      thrown = err;
    }

    assert.ok(thrown instanceof Error);
    assert.ok(thrown.message.includes('No selector property for selector object'));
  });

  it('protocol.element(using, {locateStrategy=invalid})', async function () {
    Nightwatch.api().element('css selector', {selector: '.nock', locateStrategy: 'unsupported'});

    let thrown;

    try {
      await Nightwatch.start();
    } catch (err) {
      thrown = err;
    }

    assert.ok(thrown instanceof Error);
    assert.ok(thrown.message.includes('Provided locating strategy "unsupported" is not supported'));
  });

  it('protocol.elements(using, {selector})', async function () {
    nocks
      .elementsFound()
      .elementsNotFound();

    Nightwatch.api()
      .elements('css selector', '.nock', function callback(result) {
        assert.strictEqual(result.value[0].ELEMENT, '0', 'Found elements for string selector');
      })
      .elements('css selector', '.nock-none', function callback(result) {
        assert.strictEqual(result.status, 0);
        assert.strictEqual(result.value.length, 0);
      })
      .elements('css selector', {selector: '.nock'}, function callback(result) {
        assert.strictEqual(result.value[0].ELEMENT, '0');
      })
      .elements('css selector', {selector: '.nock-none'}, function callback(result) {
        assert.strictEqual(result.status, 0);
        assert.strictEqual(result.value.length, 0);
      });

    return Nightwatch.start();
  });

  it('protocol.elements(using, null)', async function () {
    Nightwatch.api().elements('css selector', null);

    let thrown;

    try {
      await Nightwatch.start();
    } catch (err) {
      thrown = err;
    }

    assert.ok(thrown instanceof Error);
    assert.ok(thrown.message.includes('Invalid selector value specified'));
  });

  it('protocol.elements(using, {})', async function () {
    Nightwatch.api().elements('css selector', {});

    let thrown;

    try {
      await Nightwatch.start();
    } catch (err) {
      thrown = err;
    }

    assert.ok(thrown instanceof Error);
    assert.ok(thrown.message.includes('No selector property for selector object'));
  });

  it('protocol.elements(using, {selector, locateStrategy})', function () {
    nocks
      .elementsFound()
      .elementsByTag();

    Nightwatch.api()
      .elements('css selector', {selector: '.nock', locateStrategy: 'css selector'}, function callback(result) {
        assert.strictEqual(result.value[0].ELEMENT, '0');
      })
      .elements('xpath', {selector: '.nock', locateStrategy: 'css selector'}, function callback(result) {
        assert.strictEqual(result.value[0].ELEMENT, '0');
      })
      .elements('xpath', {selector: 'nock', locateStrategy: 'css selector'}, function callback(result) {
        assert.strictEqual(result.value[0].ELEMENT, '0');
      })
      .elements('css selector', {selector: '.nock', locateStrategy: null}, function callback(result) {
        assert.strictEqual(result.value[0].ELEMENT, '0');
      });

    return Nightwatch.start();
  });

  it('protocol.elements(using, {locateStrategy})', async function () {
    Nightwatch.api().elements('css selector', {locateStrategy: 'css selector'});

    let thrown;

    try {
      await Nightwatch.start();
    } catch (err) {
      thrown = err;
    }

    assert.ok(thrown instanceof Error);
    assert.ok(thrown.message.includes('No selector property for selector object'));
  });

  it('protocol.elements(using, {locateStrategy=invalid})', async function () {
    Nightwatch.api().elements('css selector', {selector: '.nock', locateStrategy: 'unsupported'});

    let thrown;

    try {
      await Nightwatch.start();
    } catch (err) {
      thrown = err;
    }

    assert.ok(thrown instanceof Error);
    assert.ok(thrown.message.includes('Provided locating strategy "unsupported" is not supported'));
  });

});
