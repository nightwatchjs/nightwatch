const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.ensure', function () {
  before(function () {
    Globals.protocolBefore();
  });

  it('test ensure.titleIs', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting for title to be "sample text"');
        assert.strictEqual(opts.result, true);
      },
      commandName: 'ensure.titleIs',
      args: ['sample text']
    });
  });

  it('test ensure.ableToSwitchToFrame', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting to be able to switch to frame');
        assert.strictEqual(opts.result, true);
      },
      commandName: 'ensure.ableToSwitchToFrame'
    });

  });

  it('test ensure.alertIsPresent', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting for alert to be present');
      },
      commandName: 'ensure.alertIsPresent'
    });

  });

  it('test ensure.titleContains', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting for title to contain "sample"');
        assert.strictEqual(opts.result, true);
      },
      commandName: 'ensure.titleContains',
      args: ['sample']
    });
  });

  it('test ensure.titleMatches', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting for title to match /sample/');
        assert.strictEqual(opts.result, true);
      },
      commandName: 'ensure.titleMatches',
      args: [/sample/]
    });

  });

  it('test ensure.urlIs', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting for URL to be "https://nightwatchjs.org"');
        assert.strictEqual(opts.result, true);
      },
      commandName: 'ensure.urlIs',
      args: ['https://nightwatchjs.org']
    });
  });

  it('test ensure.urlContains', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting for URL to contain "nightwatchjs"');
        assert.strictEqual(opts.result, true);
      },
      commandName: 'ensure.urlContains',
      args: ['nightwatchjs']
    });
  });

  it('test ensure.urlMatches', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting for URL to match /nightwatchjs/');
        assert.strictEqual(opts.result, true);
      },
      commandName: 'ensure.urlMatches',
      args: [/nightwatchjs/]
    });

  });

  it('test ensure.elementLocated', function (done) {
    Globals.protocolTest({
      async assertion(opts) {
        try {
          assert.strictEqual(opts.description, 'Waiting for element to be located By(css selector, element)');
          const result = await opts.result.getId();
          assert.strictEqual(result, '12345-6789');
          done();
        } catch (err) {
          done(err);
        }
      },
      commandName: 'ensure.elementLocated',
      args: ['element']
    });
  });

  it('test ensure.elementsLocated', function (done) {
    Globals.protocolTest({
      async assertion(opts) {
        try {
          assert.strictEqual(opts.description, 'Waiting for at least one element to be located By(css selector, element)');
          assert.ok(Array.isArray(opts.result));
          assert.strictEqual(opts.result.length, 1);
          done();
        } catch (err) {
          done(err);
        }
      },
      commandName: 'ensure.elementsLocated',
      args: ['element']
    });
  });

  it('test ensure.elementIsVisible', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting until element is visible');
        assert.notStrictEqual(opts.result, null);
      },
      commandName: 'ensure.elementIsVisible',
      args: ['@seleniumElement']
    });
  });

  it('test ensure.elementIsEnabled', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting until element is enabled');
        assert.notStrictEqual(opts.result, null);

      },
      commandName: 'ensure.elementIsEnabled',
      args: ['@seleniumElement']
    });
  });

  it('test ensure.elementIsSelected', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting until element is selected');
        assert.notStrictEqual(opts.result, null);
      },
      commandName: 'ensure.elementIsSelected',
      args: ['@seleniumElement']
    });
  });

  it('test ensure.elementIsDisabled', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting until element is disabled');
        assert.strictEqual(opts.result, null);
      },
      commandName: 'ensure.elementIsDisabled',
      args: ['@seleniumElement']
    });
  });

  it('test ensure.elementTextContains', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting until element text contains');
        assert.notStrictEqual(opts.result, null);
      },
      commandName: 'ensure.elementTextContains',
      args: ['@seleniumElement', 'text']
    });
  });


  it('test ensure.elementTextIs', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting until element text is');
        assert.notStrictEqual(opts.result, null);

      },
      commandName: 'ensure.elementTextIs',
      args: ['@seleniumElement', 'text']
    });
  });

  it('test ensure.elementTextMatches', function () {
    return Globals.protocolTest({
      assertion(opts) {
        assert.strictEqual(opts.description, 'Waiting until element text matches');
        assert.notStrictEqual(opts.result, null);

      },
      commandName: 'ensure.elementTextMatches',
      args: ['@seleniumElement', /text/]
    });
  });


});
