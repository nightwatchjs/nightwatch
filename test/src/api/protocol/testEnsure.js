const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.ensure', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('test ensure.titleIs', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.description, 'Waiting for title to be "sample text"');
        assert.strictEqual(opts.result, true);
      },
      commandName: 'ensure.titleIs',
      args: ['sample text']
    });
  });

  it('test ensure.ableToSwitchToFrame', function(){
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.description, 'Waiting to be able to switch to frame');
        assert.strictEqual(opts.result, true);
      },
      commandName: 'ensure.ableToSwitchToFrame'
    });
    
  });

  it('test ensure.alertIsPresent', function(){
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.description, 'Waiting for alert to be present');
      },
      commandName: 'ensure.alertIsPresent'
    });
    
  });

  it('test ensure.titleContains', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.description, 'Waiting for title to contain "sample"');
        assert.strictEqual(opts.result, true);
      },
      commandName: 'ensure.titleContains',
      args: ['sample']
    });
  });

  it('test ensure.titleMatches', function(){
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.description, 'Waiting for title to match /sample/');
        assert.strictEqual(opts.result, true);
      },
      commandName: 'ensure.titleMatches',
      args: [/sample/]
    });
    
  });

  it('test ensure.urlIs', function(){
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.description, 'Waiting for URL to be "https://nightwatchjs.org"');
        assert.strictEqual(opts.result, true);
      },
      commandName: 'ensure.urlIs',
      args: ['https://nightwatchjs.org']
    });
  });

  it('test ensure.urlContains', function(){
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.description, 'Waiting for URL to contain "nightwatchjs"');
        assert.strictEqual(opts.result, true);
      },
      commandName: 'ensure.urlContains',
      args: ['nightwatchjs']
    });
  });

  it('test ensure.urlMatches', function(){
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.description, 'Waiting for URL to match /nightwatchjs/');
        assert.strictEqual(opts.result, true);
      },
      commandName: 'ensure.urlMatches',
      args: [/nightwatchjs/]
    });

  });



});
