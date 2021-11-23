const assert = require('assert');
const Nightwatch = require('../../../../lib/nightwatch.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.clickAndHold()', function() {
  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.clickAndHold()', function(done) {
    const api = this.client.api;

    this.client.transport.driver.actions = function() {
      return {
        move: function() {
          return {
            press:  function() {
              return {
                perform: function () {
                  return Promise.resolve();
                }
              }
            }
          }
        }
      }
    }
    
    this.client.api.clickAndHold('#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
      assert.strictEqual(this, api);
    });

    this.client.start(done);
  });

  it('client.clickAndHold() with xpath', function(done) {

    this.client.transport.driver.actions = function() {
      return {
        move: function() {
          return {
            press:  function() {
              return {
                perform: function () {
                  return Promise.resolve();
                }
              }
            }
          }
        }
      }
    }

    this.client.api.useXpath()
      .clickAndHold('//weblogin', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .clickAndHold('css selector', '#weblogin', function callback(result) {
        assert.strictEqual(result.status, 0);
      });

    this.client.start(done);
  });

  it('client.clickAndHold() with webdriver protocol', function(done) {
    Nightwatch.initW3CClient({
      silent: false,
      output: false
    }).then(client => {
        
      client.transport.driver.actions = function() {
        return {
          move: function() {
            return {
              press:  function() {
                return {
                  perform: function () {
                    return Promise.resolve();
                  }
                }
              }
            }
          }
        }
      }

      client.api.clickAndHold('#webdriver', function(result) {
        assert.strictEqual(result.value, null);
      }).clickAndHold('css selector', '#webdriver', function(result) {
        assert.strictEqual(result.value, null);
      });

      client.start(done);
    });
  });

  it('client.clickAndHold() - element not interactable error - failed', function(done) {
    Nightwatch.initW3CClient({
      output: false,
      silent: false
    }).then(client => {
    
      client.transport.driver.actions = function() {
        return {
          move: function() {
            return {
              press:  function() {
                return {
                  perform: function () {
                    return Promise.reject(new Error('Element <h1> could not be scrolled into view'));
                  }
                }
              }
            }
          }
        }
      }

      let response;
      client.api.clickAndHold({
        retryInterval: 50,
        timeout: 100,
        selector: '#webdriver'
      }, function(result) {
        response = result;
      });

      client.start(function() {
        try {
          assert.strictEqual(response.status, -1);
          assert.strictEqual(response.value.error, 'An error occurred while running .clickAndHold() command on <#webdriver>: Element <h1> could not be scrolled into view');

          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });


});
