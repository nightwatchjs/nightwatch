module.exports = {
  setUp: function (callback) {
    callback();
  },
  
  "attributeEquals assertion passed" : function(test) {
    var Assertion = require('../../../lib/selenium/assertions/attributeEquals.js');
    var client = {
      getAttribute : function(cssSelector, attribute, callback) {
        test.equals(cssSelector, '.test_element');
        test.equals(attribute, 'role');
        callback({
          value : 'main'
        });
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, true);
        test.equals(result, 'main');
        test.equals(expected, 'main');
        test.equals(abortOnFailure, true);
        delete Assertion;
        test.done();
      }
    };
    
    var m = new Assertion();
    m.abortOnFailure = true;
    m.client = client;
    
    m.command('.test_element', 'role', 'main', 'Test message');
  },
  
  "attributeEquals assertion failed" : function(test) {
    var Assertion = require('../../../lib/selenium/assertions/attributeEquals.js');
    var client = {
      getAttribute : function(cssSelector, attribute, callback) {
        callback({
          value : 'not_expected'
        });
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, 'not_expected');
        test.equals(expected, 'main');
        test.equals(abortOnFailure, true);
        delete Assertion;
        test.done();
      }
    };
    
    var m = new Assertion();
    m.abortOnFailure = true;
    m.client = client;
    
    m.command('.test_element', 'role', 'main', 'Test message');
  },
  
  "attributeEquals assertion not found" : function(test) {
    var Assertion = require('../../../lib/selenium/assertions/attributeEquals.js');
    var client = {
      getAttribute : function(cssSelector, attribute, callback) {
        callback({
          status : -1
        });
      },
      assertion : function(passed, result, expected, msg, abortOnFailure) {
        test.equals(passed, false);
        test.equals(result, null);
        test.equals(expected, 'main');
        test.equals(abortOnFailure, true);
        delete Assertion;
        test.done();
      }
    };
    
    var m = new Assertion();
    m.abortOnFailure = true;
    m.client = client;
    
    m.command('.test_element', 'role', 'main', 'Test message');
  },
  
  tearDown : function(callback) {
    callback();
  }
}
      
