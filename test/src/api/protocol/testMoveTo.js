const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('browser commands', function() {
  let args;
  before(function() {
    Globals.protocolBefore.call(this);
    
  });

  beforeEach(function() {
    this.client.transport.Actions.session.moveTo = function(opts) {
      args = opts.args;

      return Promise.resolve(null);
    };
  });

  afterEach(function() {
    args = null;
  });

  it('testMoveTo', function () {

    return Globals.runProtocolTest({
      assertion: function() {},
      commandName: 'moveTo',
      args: ['testElement', 0, 1]
    }, this.client).then(_ => {
      assert.deepStrictEqual(args, ['testElement', 0, 1]);
    });
  });

  it('testMoveTo - no webElementId', function() {

    return Globals.runProtocolTest({
      assertion: function() {},
      commandName: 'moveTo',
      args: [2, 1]
    }, this.client).then(_ => {
      assert.deepStrictEqual(args, ['pointer', 2, 1]);
    });
  });

  it('testMoveTo - null webElementId', function() {
    return Globals.runProtocolTest({
      assertion: function() {},
      commandName: 'moveTo',
      args: [null, 2, 1]
    }, this.client).then(_ => {
      assert.deepStrictEqual(args, ['pointer', 2, 1]);
    });
  });

  it('testMove - elementId only parameters', function() {
    Globals.runProtocolTest({
      assertion: function() {},
      commandName: 'moveTo',
      args: ['testElement']
    }, this.client).then(_ => {
      assert.deepStrictEqual(args, ['testElement', 0, 0]);
    });
  });

  it('testMove - elementId only parameters', function() {
    Globals.runProtocolTest({
      assertion: function() {},
      commandName: 'moveTo',
      args: []
    }, this.client).then(_ => {
      assert.deepStrictEqual(args, ['pointer', 0, 0]);
    });
  });
    
  it('testMove - invalid parameters', function(done) {
    Globals.runProtocolTest({
      assertion: function() {},
      commandName: 'moveTo',
      args: [NaN]
    }, this.client)
      .then(_ => done(new Error('should result into error')))
      .catch(err => done());
  });
});
