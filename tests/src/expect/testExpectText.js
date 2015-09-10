var Nocks = require('../../nocks.js');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    callback();
  },

  'text to equal [PASSED]' : function(test) {
    Nocks.elementFound().text('hp vasq');
    var expect = this.client.api.expect.element('#weblogin').text.to.equal('hp vasq');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to equal: "hp vasq"');
      test.done();
    })
  },

  'text to equal [FAILED]' : function(test) {
    Nocks.elementFound().text('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').text.to.equal('vasq');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'equal \'vasq\'');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.actual, 'hp vasq');
      test.equals(expect.assertion.resultValue, 'hp vasq');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' equal', ': "', 'vasq', '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to equal: "vasq"');
      test.done();
    })
  },

  'text to NOT equal [PASSED]' : function(test) {
    Nocks.elementFound().text('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').text.to.not.equal('xx');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.resultValue, 'hp vasq');
      test.deepEqual(expect.assertion.messageParts, [ ' not equal', ': "', 'xx', '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to not equal: "xx"');
      test.done();
    })
  },

  'text to NOT equal [FAILED]' : function(test) {
    Nocks.elementFound().text('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').text.to.not.equal('hp vasq');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not equal \'hp vasq\'');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.actual, 'hp vasq');
      test.equals(expect.assertion.resultValue, 'hp vasq');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' not equal', ': "', 'hp vasq', '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to not equal: "hp vasq"');
      test.done();
    })
  },

  'text to equal with waitFor [PASSED]' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound();

    var expect = this.client.api.expect.element('#weblogin').text.to.equal('hp vasq').before(100);
    Nocks.text(null).text('hp vasq');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 100);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.retries, 1);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to equal: "hp vasq" in 100ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
      test.done();
    })
  },

  'text to equal and waitFor [FAILED] - text not equal' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 10;

    Nocks.elementFound().text('xx', 3);

    var expect = this.client.api.expect.element('#weblogin').text.to.equal('hp vasq').before(25);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 25);
      test.equals(expect.assertion.passed, false);
      test.ok(expect.assertion.retries >= 1);
      test.ok(expect.assertion.elapsedTime >= 25);
      test.equals(expect.assertion.expected, 'equal \'hp vasq\'');
      //test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to equal: "hp vasq" in 25ms');
      test.done();
    })
  },

  'text to not equal [PASSED]' : function(test) {
    Nocks.elementFound().text('xx');

    var expect = this.client.api.expect.element('#weblogin').text.to.not.equal('vasq');
    test.equals(expect.assertion.message, 'Expected element <%s> text to');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not equal \'vasq\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' not equal', ': "', 'vasq', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to not equal: "vasq"');
      test.done();
    })
  },

  'text to not equal [FAILED]' : function(test) {
    Nocks.elementFound().text('xx');

    var expect = this.client.api.expect.element('#weblogin').text.to.not.equal('xx');
    test.equals(expect.assertion.message, 'Expected element <%s> text to');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not equal \'xx\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' not equal', ': "', 'xx', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to not equal: "xx"');
      test.done();
    })
  },

  'text to not contain [PASSED]' : function(test) {
    Nocks.elementFound().text('xx');

    var expect = this.client.api.expect.element('#weblogin').text.to.not.contain('vasq');

    test.equals(expect.assertion.message, 'Expected element <%s> text to');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not contain \'vasq\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' not contain', ': "', 'vasq', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to not contain: "vasq"');
      test.done();
    })
  },

  'text to contain [PASSED]' : function(test) {
    Nocks.elementFound().text('vasq');

    var expect = this.client.api.expect.element('#weblogin').text.to.contain('vasq');

    test.equals(expect.assertion.message, 'Expected element <%s> text to');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'contain \'vasq\'');
      test.equals(expect.assertion.actual, 'vasq');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.resultValue, 'vasq');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' contain', ': "', 'vasq', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to contain: "vasq"');
      test.done();
    })
  },

  'text to not contain [FAILED]' : function(test) {
    Nocks.elementFound().text('xx');

    var expect = this.client.api.expect.element('#weblogin').text.to.not.contains('xx');
    test.equals(expect.assertion.message, 'Expected element <%s> text to');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not contain \'xx\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' not contain', ': "', 'xx', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to not contain: "xx"');
      test.done();
    })
  },

  'text to match [PASSED]' : function(test) {
    Nocks.elementFound().text('vasq');

    var expect = this.client.api.expect.element('#weblogin').text.to.match(/vasq/);

    test.equals(expect.assertion.message, 'Expected element <%s> text to');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'match \'/vasq/\'');
      test.equals(expect.assertion.actual, 'vasq');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.resultValue, 'vasq');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' match', ': "', /vasq/, '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to match: "/vasq/"');
      test.done();
    })
  },

  'text to not match [PASSED]' : function(test) {
    Nocks.elementFound().text('xx');

    var expect = this.client.api.expect.element('#weblogin').text.to.not.match(/vasq/);

    test.equals(expect.assertion.message, 'Expected element <%s> text to');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not match \'/vasq/\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' not match', ': "', /vasq/, '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to not match: "/vasq/"');
      test.done();
    })
  },

  'text to not match [FAILED]' : function(test) {
    Nocks.elementFound().text('xx');

    var expect = this.client.api.expect.element('#weblogin').text.to.not.match(/xx/);
    test.equals(expect.assertion.message, 'Expected element <%s> text to');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not match \'/xx/\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' not match', ': "', /xx/, '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to not match: "/xx/"');
      test.done();
    })
  },

  'text to equal - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').text.to.equal('vasq');
    test.equals(expect.assertion.message, 'Expected element <%s> text to');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.resultValue, null);
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' equal', ': "', 'vasq', '"', ' - element was not found' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to equal: "vasq" - element was not found');
      test.done();
    })
  },

  'text to contain - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').text.to.contain('vasq');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' contain', ': "', 'vasq', '"', ' - element was not found' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to contain: "vasq" - element was not found');
      test.done();
    })
  },

  'text to match - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').text.to.match(/vasq$/);

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' match', ': "', /vasq$/, '"', ' - element was not found' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to match: "/vasq$/" - element was not found');
      test.done();
    })
  },

  'text to match with waitFor - element not found' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').text.to.match(/vasq$/).before(60);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to match: "/vasq$/" in 60ms - element was not found');
      test.done();
    })
  },

  'text to match with waitFor - element found on retry' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementFound().text('hp vasq');

    var expect = this.client.api.expect.element('#weblogin').text.to.match(/vasq$/).before(60);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> text to match: "/vasq$/" in 60ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
      test.done();
    })
  },

  'text to match - throws exception on invalid regex' : function(test) {
    Nocks.elementFound().text('xx');

    var expect = this.client.api.expect.element('#weblogin').text;
    test.throws(function() {
      expect.which.matches('');
    }.bind(this));

    this.client.on('nightwatch:finished', function(results, errors) {
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    Nocks.cleanAll();
    //clean up
    callback();
  }
};
