const assert =  require('assert');
const CommandGlobals = require('../../../../lib/globals/commands');
const MockServer = require('../../../../lib/mockserver');
const Nightwatch = require('../../../../lib/nightwatch');


describe('browser.isPresent', function(){
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });
    
  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('isPresent - element found successfully', function(done){
    this.client.api.isPresent('#weblogin', function(result){
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, true);
    });

    this.client.start(done);
  });

  it('.isPresent - no element found', function(done) { 
    this.client.api.isPresent({
      locateStrategy: 'css selector',
      timeout: 150,
      selector: '#badElement'
    }, function(result) {
      assert.strictEqual(result.value, false);
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });

  it('.isPresent - webdriver protocol', function(done){
    Nightwatch.initW3CClient({
      silent: true,
      output: false
    })
      .then(client=>{
        client.api.isPresent('#webdriver', function(result){
          assert.strictEqual(result.value, true);
      
        }).isPresent('#weblogin', function(result){
          assert.strictEqual(result.value, true);
        });
          
        client.start(done);
      });

  
  });

  it('.isPresent - webdriver protocol no such element', function(done){
    MockServer.addMock({
      url: '/session/13521-10219-202/elements',
      postdata: {
        using: 'css selector',
        value: '#badElement'
      },
      response: {
        value: []
      }
    });
      
    Nightwatch.initW3CClient({
      silent: true,
      output: false
    }).then(client => {
      client.api.isPresent({
        selector: '#badElement',
        timeout: 150
      }, function(result){
        assert.strictEqual(result.value, false);
        
      });
            
      client.start(done);
    });
  });
});