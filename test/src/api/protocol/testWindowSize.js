const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('windowSize', function () {
  before(function () {
    Globals.protocolBefore();
  });

  it('test .windowSize() errors', async function () {
    try {
      await Globals.protocolTest({
        commandName: 'windowSize',
        args: [function () {
        }]
      });

      throw new Error('Unexpected error');
    } catch (err) {
      assert.strictEqual(err.message, 'Error while running "windowSize" command: First argument must be a window handle string.');
    }

    try {
      await Globals.protocolTest({
        commandName: 'windowSize',
        args: [function () {
        }]
      });

      throw new Error('Unexpected error');
    } catch (err) {
      assert.strictEqual(err.message, 'Error while running "windowSize" command: First argument must be a window handle string.');
    }

    try {
      await Globals.protocolTest({
        commandName: 'windowSize',
        args: ['current', 'a', 10]
      });

      throw new Error('Unexpected error');
    } catch (err) {
      assert.strictEqual(err.message, 'Error while running "windowSize" command: Width argument passed to .windowSize() must be a number.');
    }

    try {
      await Globals.protocolTest({
        commandName: 'windowSize',
        args: ['current', 10, 'a']
      });

      throw new Error('Unexpected error');
    } catch (err) {
      assert.strictEqual(err.message, 'Error while running "windowSize" command: Height argument passed to .windowSize() must be a number.');
    }

    try {
      await Globals.protocolTest({
        commandName: 'windowSize',
        args: ['current', 10]
      });

      throw new Error('Unexpected error');
    } catch (err) {
      assert.strictEqual(err.message, 'Error while running "windowSize" command: Second argument passed to .windowSize() should be a callback when not passing width and height - number given.');
    }
  });

  it('test .windowSize() GET', function () {
    return Globals.protocolTest({
      commandName: 'windowSize',
      args: ['current', function (result) {
        if (result instanceof Error) {
          throw result;
        }

        assert.deepStrictEqual(result, {status: 0, value: {width: 100, height: 100, x: 10, y: 10}});
      }]
    });
  });

  it('test .windowSize() POST', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.deepStrictEqual(opts.args[0], {width: 10, height: 10});
      },
      commandName: 'windowSize',
      args: ['current', 10, 10]
    });
  });

  it('test .windowSize() with W3C Webdriver API - GET', function () {
    return Globals.protocolTestWebdriver({
      commandName: 'windowSize',
      args: ['current', function (result) {
        if (result instanceof Error) {
          throw result;
        }

        assert.deepStrictEqual(result, {status: 0, value: {width: 100, height: 100, x: 10, y: 10}});
      }]
    });
  });
});
