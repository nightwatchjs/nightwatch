var Nocks = require('../../nocks.js');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    callback();
  },

  tearDown : function(callback) {
    this.client = null;
    Nocks.cleanAll();
    callback();
  },

  'to have css property [PASSED]' : function(test) {
    Nocks.elementFound().cssProperty('block');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.cssProperty, 'display');
      test.equals(expect.assertion.resultValue, 'block');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display"');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 1);
      test.equals(results.failed, 0);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to have css property "display"');
      test.done();
    });
  },

  'to have css property with waitFor [PASSED]' : function(test) {
    Nocks.elementFound().cssProperty('block');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').before(100);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 100);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" in 100ms - property was present in '+ expect.assertion.elapsedTime +'ms');
      test.done();
    })
  },

  'to have css property with waitFor [FAILED]' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementFound().cssProperty('', 3);

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').before(60);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" in 60ms');
      test.done();
    })
  },

  'to have css property with message [PASSED]' : function(test) {
    Nocks.elementFound().cssProperty('block');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Testing if #weblogin has display');
      test.done();
    })
  },

  'to have css property with message [FAILED]' : function(test) {
    Nocks.elementFound().cssProperty('');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Testing if #weblogin has display');
      test.done();
    });

  },

  'to have css property [FAILED]' : function(test) {
    Nocks.elementFound().cssProperty('');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.cssProperty, 'display');
      test.equals(expect.assertion.resultValue, '');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display"');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to have css property "display"');
      test.done();
    })
  },

  'to not have css property [PASSED]' : function(test) {
    Nocks.elementFound().cssProperty('');

    var expect = this.client.api.expect.element('#weblogin').to.not.have.css('display');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.expected, 'not present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.resultValue, '');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to not have css property "display"');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 1);
      test.equals(results.failed, 0);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to not have css property "display"');
      test.done();
    })
  },

  'to not have css property [FAILED]' : function(test) {
    Nocks.elementFound().cssProperty('x');

    var expect = this.client.api.expect.element('#weblogin').to.not.have.css('display');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'not present');
      test.equals(expect.assertion.actual, 'present');
      test.equals(expect.assertion.resultValue, 'x');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to not have css property "display"');
      test.deepEqual(expect.assertion.elementResult, { ELEMENT: '0' });
      test.deepEqual(expect.assertion.messageParts, []);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to not have css property "display"');
      test.done();
    })
  },


  'to have css property - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.selector, '#weblogin');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.resultValue, null);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" - element was not found');
      test.deepEqual(expect.assertion.messageParts, [' - element was not found']);
      test.equals(results.passed, 0);
      test.equals(results.failed, 1);
      test.equals(results.tests[0].message, 'Expected element <#weblogin> to have css property "display" - element was not found');
      test.done();
    })
  },

  'to have css property equal to [PASSED]' : function(test) {
    Nocks.elementFound().cssProperty('block');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('block');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" equal to: "block"');
      test.done();
    })
  },

  'to have css property which equals [PASSED]' : function(test) {
    Nocks.elementFound().cssProperty('block');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.equals('block');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" which equals: "block"');
      test.done();
    })
  },

  'to have css property equal to [FAILED]' : function(test) {
    Nocks.elementFound().cssProperty('block');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('b');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'equal to \'b\'');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.actual, 'block');
      test.equals(expect.assertion.resultValue, 'block');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' equal to', ': "', 'b', '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" equal to: "b"');
      test.done();
    })
  },

  'to have css property NOT equal to [PASSED]' : function(test) {
    Nocks.elementFound().cssProperty('block');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.equal('xx');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.resultValue, 'block');
      test.deepEqual(expect.assertion.messageParts, [ ' not equal to', ': "', 'xx', '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" not equal to: "xx"');
      test.done();
    })
  },

  'to have css property NOT equal to [FAILED]' : function(test) {
    Nocks.elementFound().cssProperty('block');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.equal('block');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not equal to \'block\'');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.actual, 'block');
      test.equals(expect.assertion.resultValue, 'block');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' not equal to', ': "', 'block', '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" not equal to: "block"');
      test.done();
    })
  },

  'to have css property equal with waitFor [PASSED]' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('block').before(110);
    Nocks.cssProperty('').cssProperty('block');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 110);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.retries, 1);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" equal to: "block" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
      test.done();
    })
  },

  'to have css property equal and waitFor [FAILED] - property not set' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound().cssProperty('', 3);

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('block').before(120);

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 120);
      test.equals(expect.assertion.passed, false);
      test.ok(expect.assertion.retries > 1);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" equal to: "block" in 120ms');
      test.done();
    })
  },

  'to have css property equal and waitFor [FAILED] - property not equal' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 10;
    Nocks.elementFound().cssProperty('xx', 3);

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('block').before(20);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 20);
      test.equals(expect.assertion.passed, false);
      test.ok(expect.assertion.retries >= 1);
      test.ok(expect.assertion.elapsedTime >= 20);
      test.equals(expect.assertion.expected, 'equal to \'block\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" equal to: "block" in 20ms');
      test.done();
    })
  },


  'to have css property which contains [PASSED]' : function(test) {
    Nocks.elementFound().cssProperty('block');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.contains('block');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'contains \'block\'');
      test.equals(expect.assertion.actual, 'block');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.resultValue, 'block');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' which ', 'contains', ': "', 'block', '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" which contains: "block"');
      test.done();
    })
  },
  'to have css property equal with message [PASSED]' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 200;
    Nocks.elementFound().cssProperty('block');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display which equals block').equal('block');
    Nocks.cssProperty('').cssProperty('block');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.actual, 'block');
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Testing if #weblogin has display which equals block');
      test.done();
    })
  },

  'to have css property equal with message [FAILED] - property not set' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound().cssProperty('');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display which equals block').equal('block');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Testing if #weblogin has display which equals block');
      test.done();
    })
  },

  'to have css property equal with message [FAILED] - property not equal' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 10;
    Nocks.elementFound().cssProperty('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display which equals block').equal('block');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.message, 'Testing if #weblogin has display which equals block');
      test.done();
    })
  },

  'to have css property not contains [PASSED]' : function(test) {
    Nocks.elementFound().cssProperty('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.contains('vasq');

    test.equals(expect.assertion.message, 'Expected element <%s> to have css property "display"');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not contain \'vasq\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' not contain', ': "', 'vasq', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" not contain: "vasq"');
      test.done();
    })
  },

  'to have css property not contains [FAILED]' : function(test) {
    Nocks.elementFound().cssProperty('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.contains('xx');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not contain \'xx\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' not contain', ': "', 'xx', '"' ] );
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" not contain: "xx"');
      test.done();
    })
  },

  'to have css property which matches [PASSED]' : function(test) {
    Nocks.elementFound().cssProperty('block');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.matches(/block/);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'matches \'/block/\'');
      test.equals(expect.assertion.actual, 'block');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.resultValue, 'block');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' which ', 'matches', ': "', /block/, '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" which matches: "/block/"');
      test.done();
    })
  },

  'to have css property not match [PASSED]' : function(test) {
    Nocks.elementFound().cssProperty('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.match(/vasq/);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not match \'/vasq/\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, true);
      test.deepEqual(expect.assertion.messageParts, [ ' not match', ': "', /vasq/, '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" not match: "/vasq/"');
      test.done();
    })
  },

  'to have css property not match [FAILED]' : function(test) {
    Nocks.elementFound().cssProperty('xx');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.match(/xx/);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'not match \'/xx/\'');
      test.equals(expect.assertion.actual, 'xx');
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.resultValue, 'xx');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' not match', ': "', /xx/, '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" not match: "/xx/"');
      test.done();
    })
  },

  'to have css property equal to - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('vasq');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.negate, false);
      test.equals(expect.assertion.resultValue, null);
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' equal to', ': "', 'vasq', '"', ' - element was not found' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" equal to: "vasq" - element was not found');
      test.done();
    })
  },

  'to have css property contains - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.contains('vasq');

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' which ', 'contains', ': "', 'vasq', '"', ' - element was not found' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" which contains: "vasq" - element was not found');
      test.done();
    })
  },

  'to have css property with waitFor - element not found' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').before(60);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" in 60ms - element was not found');
      test.done();
    })
  },

  'to have css property with waitFor - element found on retry' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementFound().cssProperty('block');

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').before(60);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" in 60ms - property was present in '+ expect.assertion.elapsedTime +'ms');
      test.done();
    })
  },

  'to have css property match - element not found' : function(test) {
    Nocks.elementNotFound();

    var expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.matches(/vasq$/);

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.expected, 'present');
      test.equals(expect.assertion.actual, 'not present');
      test.equals(expect.assertion.passed, false);
      test.deepEqual(expect.assertion.messageParts, [ ' which ', 'matches', ': "', /vasq$/, '"', ' - element was not found' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" which matches: "/vasq$/" - element was not found');
      test.done();
    })
  }

};
