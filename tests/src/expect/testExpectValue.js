var Nocks = require('../../nocks.js');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    callback();
  },

  'to have value equal to [PASSED]' : function(test) {
    Nocks.elementFound().value('hp vasq');
    var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "hp vasq"');
      test.done();
    })
  },

  'to have value which equals [PASSED]' : function(test) {
    Nocks.elementFound().value('hp vasq');
    var expect = this.client.api.expect.element('#weblogin').to.have.value.which.equals('hp vasq');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value which equals: "hp vasq"');
      test.done();
    })
  },

  'to have value equal to [FAILED]' : function(test) {
    Nocks.elementFound().value('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('vasq');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'equal to \'vasq\'');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.actual, 'hp vasq');
      test.equals(expect.assertion.resultValue, 'hp vasq');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' equal to', ': "', 'vasq', '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "vasq"');
      test.done();
    })
  },

  'to have value NOT equal to [PASSED]' : function(test) {
    Nocks.elementFound().value('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('xx');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.resultValue, 'hp vasq');
      test.deepEqual(expect.assertion.messageParts, [ ' not equal to', ': "', 'xx', '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value not equal to: "xx"');
      test.done();
    })
  },

  'to have value NOT equal to [FAILED]' : function(test) {
    Nocks.elementFound().value('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('hp vasq');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not equal to \'hp vasq\'');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.actual, 'hp vasq');
      test.equals(expect.assertion.resultValue, 'hp vasq');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' not equal to', ': "', 'hp vasq', '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value not equal to: "hp vasq"');
      test.done();
    })
  },

  'to have value equal with waitFor [PASSED]' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);
    Nocks.value(null).value('hp vasq');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 110);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.retries, 1);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
      test.done();
    })
  },

  'to have value equal and waitFor [FAILED] - value not equal' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().value('xx', 3);

    var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 110);
      test.equals(expect.assertion.passed, false);
      test.ok(expect.assertion.retries >= 1);
      test.ok(expect.assertion.elapsedTime >= 110);
      test.equals(expect.assertion.expected, 'equal to \'hp vasq\'');
      //test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms');
      test.done();
    })
  },

  'to have value not equal to [PASSED]' : function(test) {
    Nocks.elementFound().value('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('vasq');
    test.equals(expect.assertion.message, 'Expected element <%s> to have value');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not equal to \'vasq\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' not equal to', ': "', 'vasq', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value not equal to: "vasq"');
      test.done();
    })
  },

  'to have value not equal to [FAILED]' : function(test) {
    Nocks.elementFound().value('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('xx');
    test.equals(expect.assertion.message, 'Expected element <%s> to have value');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not equal to \'xx\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' not equal to', ': "', 'xx', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value not equal to: "xx"');
      test.done();
    })
  },

  'to have value not contains [PASSED]' : function(test) {
    Nocks.elementFound().value('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.value.not.contains('vasq');

    test.equals(expect.assertion.message, 'Expected element <%s> to have value');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not contain \'vasq\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' not contain', ': "', 'vasq', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value not contain: "vasq"');
      test.done();
    })
  },

  'to have value contains [PASSED]' : function(test) {
    Nocks.elementFound().value('vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.value.which.contains('vasq');

    test.equals(expect.assertion.message, 'Expected element <%s> to have value');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'contains \'vasq\'');
      test.equals(expect.assertion.actual, 'vasq');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.resultValue, 'vasq');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' which ', 'contains', ': "', 'vasq', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value which contains: "vasq"');
      test.done();
    })
  },

  'to have value not contains [FAILED]' : function(test) {
    Nocks.elementFound().value('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.value.not.contains('xx');
    test.equals(expect.assertion.message, 'Expected element <%s> to have value');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not contain \'xx\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' not contain', ': "', 'xx', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value not contain: "xx"');
      test.done();
    })
  },

  'to have value not match [PASSED]' : function(test) {
    Nocks.elementFound().value('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.value.not.match(/vasq/);

    test.equals(expect.assertion.message, 'Expected element <%s> to have value');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not match \'/vasq/\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' not match', ': "', /vasq/, '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value not match: "/vasq/"');
      test.done();
    })
  },

  'to have value which matches [PASSED]' : function(test) {
    Nocks.elementFound().value('vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.value.which.matches(/vasq/);

    test.equals(expect.assertion.message, 'Expected element <%s> to have value');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'matches \'/vasq/\'');
      test.equals(expect.assertion.actual, 'vasq');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.resultValue, 'vasq');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' which ', 'matches', ': "', /vasq/, '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value which matches: "/vasq/"');
      test.done();
    })
  },

  'to have value not match [FAILED]' : function(test) {
    Nocks.elementFound().value('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.value.not.match(/xx/);
    test.equals(expect.assertion.message, 'Expected element <%s> to have value');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not match \'/xx/\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' not match', ': "', /xx/, '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value not match: "/xx/"');
      test.done();
    })
  },

  'to have value equal to - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('vasq');
    test.equals(expect.assertion.message, 'Expected element <%s> to have value');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.resultValue, null);
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' equal to', ': "', 'vasq', '"', ' - element was not found' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "vasq" - element was not found');
      test.done();
    })
  },

  'to have value which contains - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.value.which.contains('vasq');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' which ', 'contains', ': "', 'vasq', '"', ' - element was not found' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value which contains: "vasq" - element was not found');
      test.done();
    })
  },

  'to have value match - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.value.which.matches(/vasq$/);

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' which ', 'matches', ': "', /vasq$/, '"', ' - element was not found' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value which matches: "/vasq$/" - element was not found');
      test.done();
    })
  },

  'to have value equal to with waitFor - element not found' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(60);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "hp vasq" in 60ms - element was not found');
      test.done();
    })
  },

  'to have value equal with waitFor - element found on retry' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementNotFound().elementFound().value('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 110);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
      test.done();
    })
  },

  'to have value match - throws exception on invalid regex' : function(test) {
    Nocks.elementFound().value('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.value;
    test.throws(function() {
      expect.which.matches('');
    }.bind(this));

    this.client.on('nightwatch:finished', function(results, errors) {
      test.done();
    });
  },

  'to have value equal and waitFor [FAILED] - value not found' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);

    Nocks.elementFound().value('xx', 4);

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 110);
      test.equals(expect.assertion.passed, false);
      test.ok(expect.assertion.retries > 1);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms');
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    Nocks.cleanAll();
    // clean up
    callback();
  }
};
