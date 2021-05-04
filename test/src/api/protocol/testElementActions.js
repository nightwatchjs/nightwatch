const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('element W3C Webdriver actions', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('test click() with W3C WebDriver', function() {
    return Globals.protocolTestWebdriver({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.deepStrictEqual(opts.data, {
          id: 'abc-12345'
        });
        assert.strictEqual(opts.path, '/session/1352110219202/element/abc-12345/click');
      },
      commandName: 'elementIdClick',
      args: ['abc-12345']
    });
  });

  it('test clearValue() with W3C WebDriver', function() {
    return Globals.protocolTestWebdriver({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.deepStrictEqual(opts.data, {
          id: 'abc-12345'
        });
        assert.strictEqual(opts.path, '/session/1352110219202/element/abc-12345/clear');
      },
      commandName: 'elementIdClear',
      args: ['abc-12345']
    });
  });
});
