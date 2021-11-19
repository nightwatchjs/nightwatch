const assert = require('assert');
const Nightwatch = require('../../../../lib/nightwatch.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.rightClick()', function() {
  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.rightClick()', function(done) {
    const api = this.client.api;
    this.client.transport.driver.actions = function() {
      return {
        contextClick: function() {
          return {
            perform:  function() {
              return Promise.resolve()
            }
          }
        }
      }
    }
    this.client.api.rightClick('#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
      assert.strictEqual(this, api);
    });

    this.client.start(done);
  });

  it('client.rightClick() with xpath', function(done) {

    this.client.transport.driver.actions = function() {
      return {
        contextClick: function() {
          return {
            perform:  function() {
              return Promise.resolve()
            }
          }
        }
      }
    }

    this.client.api.useXpath()
      .rightClick('//weblogin', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .rightClick('css selector', '#weblogin', function callback(result) {
        assert.strictEqual(result.status, 0);
      });

    this.client.start(done);
  });

  it('client.rightClick() with webdriver protocol', function(done) {
    Nightwatch.initW3CClient({
      silent: false,
      output: false
    }).then(client => {
        
      this.client.transport.driver.actions = function() {
        return {
          contextClick: function() {
            return {
              perform:  function() {
                return Promise.resolve()
              }
            }
          }
        }
      }

      client.api.rightClick('#webdriver', function(result) {
        assert.strictEqual(result.value, null);
      }).rightClick('css selector', '#webdriver', function(result) {
        assert.strictEqual(result.value, null);
      });

      client.start(done);
    });
  });

  it('client.rightClick() - element not interactable error - failed', function(done) {
    Nightwatch.initW3CClient({
      output: false,
      silent: false
    }).then(client => {
    
      client.transport.driver.actions = function() {
        return {
          contextClick: function() {
            return {
              perform:  function() {
                return Promise.reject(new Error('Element <h1> could not be scrolled into view'))
              }
            }
          }
        }
      }    

      let response;
      client.api.rightClick({
        retryInterval: 50,
        timeout: 100,
        selector: '#webdriver'
      }, function(result) {
        response = result;
      });

      client.start(function() {
        try {
          assert.strictEqual(response.status, -1);
          assert.strictEqual(response.value.error, 'An error occurred while running .rightClick() command on <#webdriver>: Element <h1> could not be scrolled into view');

          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });


});
