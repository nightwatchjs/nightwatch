const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.registerBasicAuth()', function () {
  beforeEach(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.registerBasicAuth()', function (done) {
    let expectedUsername;
    let expectedPassword;

    this.client.transport.driver.createCDPConnection =  function() {
      return  Promise.resolve();
    }
    this.client.transport.driver.register =  (username,password) =>{
      expectedUsername = username;
      expectedPassword = password
    }
    this.client.api.registerBasicAuth('nightwatch', 'BarnOwl', function (){
      assert.strictEqual(expectedUsername,'nightwatch');
      assert.strictEqual(expectedPassword,'BarnOwl')
    });

    this.client.start(done);
  });

});
