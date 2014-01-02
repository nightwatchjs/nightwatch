module.exports = {
  setUp: function (callback) {
    callback();
  },
  
  "containsText assertion passed" : function(test) {
    var Assertion = require('../../../lib/selenium/assertions/containsText.js');
    var client = {
      getText : function(cssSelector, callback) {
        test.equals(cssSelector, '.test_element');
        callback({
          value : 'expected text result'
        });
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, true);
        test.equals(result, 'expected text result');
        test.equals(expected, 'text result');
        test.equals(abortOnFailure, true);
        delete Assertion;
        test.done();
      }
    };
    
    var m = new Assertion();
    m.abortOnFailure = true;
    m.client = client;
    
    m.command('.test_element', 'text result', 'Test message');
  },
  
  "containsText assertion failed" : function(test) {
    var Assertion = require('../../../lib/selenium/assertions/containsText.js');
    var client = {
      getText : function(cssSelector, callback) {
        callback({
          value : 'not_expected'
        });
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, 'not_expected');
        test.equals(expected, 'text result');
        test.equals(abortOnFailure, true);
        delete Assertion;
        test.done();
      }
    };
    
    var m = new Assertion();
    m.abortOnFailure = true;
    m.client = client;
    
    m.command('.test_element', 'text result', 'Test message');
  },
  
  "containsText assertion not found" : function(test) {
    var Assertion = require('../../../lib/selenium/assertions/containsText.js');
    var client = {
      getText : function(cssSelector, callback) {
        callback({
          status : -1
        });
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, null);
        test.equals(expected, 'text result');
        test.equals(abortOnFailure, true);
        delete Assertion;
        test.done();
      }
    };
    
    var m = new Assertion();
    m.abortOnFailure = true;
    m.client = client;
    
    m.command('.test_element', 'text result', 'Test message');
  },
  
  tearDown : function(callback) {
    callback();
  }
}
      
