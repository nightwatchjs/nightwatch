const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');


describe('setAttribute', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.setAttribute()', function(done) {
    let commandArgs;
    
    // eslint-disable-next-line
    const fn = function(e,a,v){try{if(e&&typeof e.setAttribute=='function'){e.setAttribute(a,v);}return true;}catch(err){return{error:err.message,message:err.name+': '+err.message};}};
    const script = 'var passedArgs = Array.prototype.slice.call(arguments,0); ' +
      'return (' + fn.toString() + ').apply(window, passedArgs);';

    this.client.transport.driver.executeScript = function(scriptFn, element, attr, value) {
      //moveToArgs = args;
      commandArgs = [scriptFn, element, attr, value];

      return Promise.resolve({
        status: 0
      });
    };

    this.client.api.setAttribute('css selector', '#weblogin', 'disabled', 'true', function(result) {
      assert.strictEqual(commandArgs.length, 4);
      assert.strictEqual(commandArgs[0], script);
      assert.deepStrictEqual(commandArgs[1], {
        ELEMENT: '0'
      });
      assert.strictEqual(commandArgs[2], 'disabled');
      assert.strictEqual(commandArgs[3], 'true');
      assert.strictEqual(result.status, 0);
    }).setAttribute('#weblogin', 'disabled', 0, function(result) {
      assert.strictEqual(commandArgs.length, 4);
      assert.strictEqual(commandArgs[0], script);
      assert.deepStrictEqual(commandArgs[1], {
        ELEMENT: '0'
      });
      assert.strictEqual(commandArgs[2], 'disabled');
      assert.strictEqual(commandArgs[3], 0);
    });

    this.client.start(done);
  });
});
