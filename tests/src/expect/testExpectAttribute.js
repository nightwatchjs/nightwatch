var Nocks = require('../../nocks.js');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    callback();
  },

  'to have attribute [PASSED]' : function(test) {
    Nocks.elementFound().attributeValue('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.attribute, 'class');
      test.equals(expect.assertion.resultValue, 'hp vasq');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class"');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 1);
      test.equals(results.failed, 0);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to have attribute "class"');
      test.done();
    })
  },

  'to have attribute with waitFor [PASSED]' : function(test) {
    Nocks.elementFound().attributeValue('hp vasq');
    this.client.api.globals.abortOnAssertionFailure = false;

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(100);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 100);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.abortOnFailure, false);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 100ms - attribute was present in '+ expect.assertion.elapsedTime +'ms');
      test.done();
    })
  },

  'to have attribute with implicit waitFor [PASSED]' : function(test) {
    Nocks.elementFound().attributeValue('hp vasq');
    this.client.api.globals.abortOnAssertionFailure = false;
    this.client.api.globals.waitForConditionTimeout = 65;

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 65);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" - attribute was present in '+ expect.assertion.elapsedTime +'ms');
      test.done();
    })
  },

  'to have attribute with waitFor [FAILED]' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().attributeValue(null);

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(60);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.abortOnFailure, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 60ms - attribute was not found');
      test.done();
    })
  },

  'to have attribute with message [PASSED]' : function(test) {
    Nocks.elementFound().attributeValue('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has "class"');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Testing if #weblogin has "class"');
      test.equals(results.tests[0].message, 'Testing if #weblogin has "class"');
      test.done();
    })
  },

  'to have attribute with message [FAILED]' : function(test) {

    Nocks.elementFound().attributeValue(null);

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has "class"');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Testing if #weblogin has "class" - attribute was not found');
      test.equals(results.tests[0].message, 'Testing if #weblogin has "class" - attribute was not found');
      test.done();
    })
  },

  'to have attribute [FAILED]' : function(test) {
    Nocks.elementFound().attributeValue(null);

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'found');
      test.equals(expect.assertion.actual, 'not found');
      test.equals(expect.assertion.attribute, 'class');
      test.equals(expect.assertion.resultValue, null);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" - attribute was not found');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, [ ' - attribute was not found' ]);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to have attribute "class" - attribute was not found');
      test.done();
    })
  },

  'to not have attribute [PASSED]' : function(test) {
    Nocks.elementFound().attributeValue(null);

    var expect = this.client.api.expect.element('#weblogin').to.not.have.attribute('class');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.expected, 'not found');
      test.equals(expect.assertion.actual, 'not found');
      test.equals(expect.assertion.resultValue, null);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to not have attribute "class"');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 1);
      test.equals(results.failed, 0);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to not have attribute "class"');
      test.done();
    })
  },

  'to not have attribute [FAILED]' : function(test) {
    Nocks.elementFound().attributeValue('');

    var expect = this.client.api.expect.element('#weblogin').to.not.have.attribute('class');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'not found');
      test.equals(expect.assertion.actual, 'found');
      test.equals(expect.assertion.resultValue, '');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to not have attribute "class"');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to not have attribute "class"');
      test.done();
    })
  },

  'to have attribute - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.resultValue, null);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" - element was not found');
      test.deepEqual(expect.assertion.messageParts, [' - element was not found']);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to have attribute "class" - element was not found');
      test.done();
    })
  },

  'to have attribute equal to [PASSED]' : function(test) {
    Nocks.elementFound().attributeValue('hp vasq');
    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq"');
      test.done();
    })
  },

  'to have attribute which equals [PASSED]' : function(test) {
    Nocks.elementFound().attributeValue('hp vasq');
    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.equals('hp vasq');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" which equals: "hp vasq"');
      test.done();
    })
  },

  'to have attribute equal to [FAILED]' : function(test) {
    Nocks.elementFound().attributeValue('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('vasq');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'equal to \'vasq\'');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.actual, 'hp vasq');
      test.equals(expect.assertion.resultValue, 'hp vasq');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' equal to', ': "', 'vasq', '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "vasq"');
      test.done();
    })
  },

  'to have attribute NOT equal to [PASSED]' : function(test) {
    Nocks.elementFound().attributeValue('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.equal('xx');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.actual, 'hp vasq');
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.resultValue, 'hp vasq');
      test.deepEqual(expect.assertion.messageParts, [ ' not equal to', ': "', 'xx', '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not equal to: "xx"');
      test.done();
    })
  },

  'to have attribute NOT equal to [FAILED]' : function(test) {
    Nocks.elementFound().attributeValue('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.equal('hp vasq');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not equal to \'hp vasq\'');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.actual, 'hp vasq');
      test.equals(expect.assertion.resultValue, 'hp vasq');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' not equal to', ': "', 'hp vasq', '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not equal to: "hp vasq"');
      test.done();
    })
  },

  'to have attribute equal with waitFor [PASSED]' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(110);
    Nocks.attributeValue(null).attributeValue('hp vasq');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 110);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.retries, 1);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
      test.done();
    })
  },

  'to have attribute equal and waitFor [FAILED] - attribute not found' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(110);
    Nocks.attributeValue(null).attributeValue(null);

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 110);
      test.equals(expect.assertion.passed, false);
      test.ok(expect.assertion.retries > 1);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 110ms - attribute was not found');
      test.done();
    })
  },

  'to have attribute equal and waitFor [FAILED] - attribute not equal' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 10;
    Nocks.elementFound().attributeValue('xx').attributeValue('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(11);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 11);
      test.equals(expect.assertion.passed, false);
      test.ok(expect.assertion.retries >= 1);
      test.ok(expect.assertion.elapsedTime >= 11);
      test.equals(expect.assertion.expected, 'equal to \'hp vasq\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 11ms');
      test.done();
    })
  },

  'to have attribute equal to with message [PASSED]' : function(test) {
    Nocks.elementFound().attributeValue('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has class which equals hp vasq').equal('hp vasq');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Testing if #weblogin has class which equals hp vasq');
      test.done();
    })
  },


  'to have attribute equal with message [FAILED] - attribute not found' : function(test) {
    Nocks.elementFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has class which equals hp vasq').equal('hp vasq');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Testing if #weblogin has class which equals hp vasq - attribute was not found');
      test.done();
    })
  },


  'to have attribute equal with message [FAILED] - attribute not equal' : function(test) {
    Nocks.elementFound().attributeValue('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has class which equals hp vasq').equal('hp vasq');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.message, 'Testing if #weblogin has class which equals hp vasq');
      test.done();
    })
  },

  'to have attribute not contains [PASSED]' : function(test) {
    Nocks.elementFound().attributeValue('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.contains('vasq');

    test.equals(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not contain \'vasq\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' not contain', ': "', 'vasq', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not contain: "vasq"');
      test.done();
    })
  },

  'to have attribute which contains [PASSED]' : function(test) {
    Nocks.elementFound().attributeValue('vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.contains('vasq');

    test.equals(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'contains \'vasq\'');
      test.equals(expect.assertion.actual, 'vasq');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.resultValue, 'vasq');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' which ', 'contains', ': "', 'vasq', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" which contains: "vasq"');
      test.done();
    })
  },

  'to have attribute not contains [FAILED]' : function(test) {
    Nocks.elementFound().attributeValue('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.contains('xx');
    test.equals(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not contain \'xx\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' not contain', ': "', 'xx', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not contain: "xx"');
      test.done();
    })
  },

  'to have attribute which matches [PASSED]' : function(test) {
    Nocks.elementFound().attributeValue('vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.matches(/vasq/);

    test.equals(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'matches \'/vasq/\'');
      test.equals(expect.assertion.actual, 'vasq');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.resultValue, 'vasq');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' which ', 'matches', ': "', /vasq/, '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" which matches: "/vasq/"');
      test.done();
    })
  },

  'to have attribute not match [PASSED]' : function(test) {
    Nocks.elementFound().attributeValue('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.match(/vasq/);

    test.equals(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not match \'/vasq/\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' not match', ': "', /vasq/, '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not match: "/vasq/"');
      test.done();
    })
  },

  'to have attribute not match [FAILED]' : function(test) {
    Nocks.elementFound().attributeValue('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.match(/xx/);
    test.equals(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not match \'/xx/\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' not match', ': "', /xx/, '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not match: "/xx/"');
      test.done();
    })
  },

  'to have attribute equal to - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('vasq');
    test.equals(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.resultValue, null);
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' equal to', ': "', 'vasq', '"', ' - element was not found' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "vasq" - element was not found');
      test.done();
    })
  },

  'to have attribute contains - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.contains('vasq');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' which ', 'contains', ': "', 'vasq', '"', ' - element was not found' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" which contains: "vasq" - element was not found');
      test.done();
    })
  },

  'to have attribute match - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.matches(/vasq$/);

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' which ', 'matches', ': "', /vasq$/, '"', ' - element was not found' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" which matches: "/vasq$/" - element was not found');
      test.done();
    })
  },

  'to have attribute with waitFor - element not found' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(60);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 60ms - element was not found');
      test.done();
    })
  },

  'to have attribute with waitFor - element found on retry' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementFound().attributeValue('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(60);

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 60ms - attribute was present in ' + expect.assertion.elapsedTime + 'ms');
      test.done();
    })
  },

  'to have attribute match - throws exception on invalid regex' : function(test) {
    Nocks.elementFound().attributeValue('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');
    test.throws(function() {
      expect.which.matches('');
    }.bind(this));

    this.client.on('nightwatch:finished', function(results, errors) {
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
