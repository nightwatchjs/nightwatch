const assert = require('assert');
const path = require('path');
const common = require('../../../common.js');
const NightwatchClient = common.require('index.js');

describe('Test CLI Runner in Sequential Mode', function () {
  
  beforeEach(function() {
    NightwatchClient.argv = {
      _: process.argv.slice(2),
      c:'./nightwatch.json',
      config:'./nightwatch.json',
      e: ['safari', 'chrome'],
      env:['safari', 'chrome'],
      r:'junit',
      reporter:'junit'
    };
    
    const Utils = common.require('utils');
    const testPath = path.join(__dirname, '../../../sampletests/async/test/sample.js');
  
    NightwatchClient.cli = function(callback) {
      const argv = this.argv;
  
      if (!Utils.isFunction(callback)) {
        throw new Error('Supplied callback argument needs to be a function.');
      }
  
      if (Array.isArray(argv.env)){
        // Enable running tests in sequential mode for supported and provided environments
        if (argv.parallel){
          throw new Error('Sequential and parallel modes are not yet supported together.');
        }
        
        return argv.env.reduce((accumulator, env) => {
          return accumulator.then(_ => callback({
            ...argv, 
            env, 
            e: env, 
            sequential: true
          }));
        }, Promise.resolve());
      } else {
        callback(argv);
      }
    };  
  })
  
  it('Passed array of environments to check sequential mode enabled', function () {
    NightwatchClient.cli(function(argv) {
      let runner = NightwatchClient.CliRunner({...argv, source: testPath});
      assert.strictEqual(argv.sequential, true);
      assert.strictEqual(NightwatchClient.argv.sequential, undefined);
      assert.ok(NightwatchClient.argv.env.includes(argv.env));
    })
  });

  it('To check if parallel mode enabled', function(){
    NightwatchClient.argv = {
      ...NightwatchClient.argv,
      parallel: true
    }

    assert.throws(function() {
      NightwatchClient.cli(function(argv) {
        NightwatchClient.CliRunner({...argv, source: testPath});
      })
    }, /Error: Sequential and parallel modes are not yet supported together./);
  })
});
