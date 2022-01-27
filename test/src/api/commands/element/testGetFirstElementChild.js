const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const Nightwatch = require('../../../../lib/nightwatch.js');

xdescribe('browser.getFirstElementChild', function(){

  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });
    
  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('.getFirstElementChild', function(done){
      
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/element',
      method: 'POST',
      postdata: {
        using: 'xpath',
        value: './child::*'
      },
      response: {
        value: {
          'ELEMENT': '1'
        }
      }
    }, true);

    this.client.api.getFirstElementChild('#weblogin', function callback(result){
      assert.strictEqual(result.value.getId(), '1');
    });
    this.client.start(done);
  });


  it('.getFirstElementChild - no such element', function(done) {

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      method: 'POST',
      postdata: {
        using: 'css selector',
        value: '#badDriver'
      },
     
      response: {
        status: 0,
        sessionId: '1352110219202',
        value: [{
          ELEMENT: '2'
        }]
      }
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/2/element',
      method: 'POST',
      postdata: {
        using: 'xpath',
        value: './child::*'
      },
      statusCode: 404,
      response: {
        status: 7,
        value: {
          message: 'no such element: Unable to locate element: {"method":"xpath","selector":"./child::*"}'
        }
      }
    });

    this.client.api.getFirstElementChild('#badDriver', function callback(result){
      assert.strictEqual(result.value, null);
    });
    
    this.client.start(done);
  });



  it('.getFirstElementChild - webdriver protcol', function(done){
    Nightwatch.initW3CClient({
      silent: true,
      output: false
    }).then(client => {

      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/element',
        response: {
          value: {
            'element-6066-11e4-a52e-4f735466cecf': 'f54dc0ef-c84f-424a-bad0-16fef6595a70'
          }
        }
      }, true);

      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/element',
        response: {
          value: {
            'element-6066-11e4-a52e-4f735466cecf': 'f54dc0ef-c84f-424a-bad0-16fef6595a70'
          }
        }
      }, true);
  
      client.api.getFirstElementChild('#webdriver', function(result) {
        assert.strictEqual(result.value.getId(), 'f54dc0ef-c84f-424a-bad0-16fef6595a70');
      }).getFirstElementChild('#webdriver', function callback(result){
        assert.strictEqual(result.value.getId(), 'f54dc0ef-c84f-424a-bad0-16fef6595a70');
      });
  
      client.start(done);
    });
  });

  it('.getFirstElementChild - webdriver protcol no such element', function(done){
    Nightwatch.initW3CClient({
      silent: true,
      output: false
    }).then(client => {

      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/element',
        statusCode: 404,
        response: {
          value: {
            error: 'no such element',
            message: 'Unable to locate element:',
            stacktrace: ''
           
          }
        }
      });
  
      client.api.getFirstElementChild('#webdriver', function(result) {
        assert.strictEqual(result.value, null);
      });
  
      client.start(done);
    });
  });

});