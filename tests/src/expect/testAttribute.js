var nock = require('nock');
var flag = require('chai-nightwatch').flag;

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  'test expect element to have attribute [PASSED]' : function(test) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [ { ELEMENT: '0' } ]
      })
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: 'hp vasq',
        state : 'success'
      });

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

  'test expect element to have attribute with waitFor [PASSED]' : function(test) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [ { ELEMENT: '0' } ]
      })
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: 'hp vasq',
        state : 'success'
      });

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(100);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 100);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 100ms - attribute was present in '+ expect.assertion.elapsedTime +'ms');
      test.done();
    })
  },

  'test expect element to have attribute with waitFor [FAILED]' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [ { ELEMENT: '0' } ]
      })
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: null,
        state : 'success'
      });

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(60);
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equal(expect.assertion.waitForMs, 60);
      test.equals(expect.assertion.passed, false);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 60ms - attribute was not found');
      test.done();
    })
  },

  'test expect element to have attribute [FAILED]' : function(test) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [ { ELEMENT: '0' } ]
      })
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: null,
        state : 'success'
      });

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

  'test expect element to not have attribute [PASSED]' : function(test) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [{ELEMENT: '0'}]
      })
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: null,
        state : 'success'
      });

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

  'test expect element to not have attribute [FAILED]' : function(test) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [ { ELEMENT: '0' } ]
      })
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: '',
        state : 'success'
      });

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

  'test expect element to have attribute - element not found' : function(test) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements')
      .reply(200, {
        status: 0,
        state: 'success',
        value: []
      });

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

  'test expect element to have attribute equal to [PASSED]' : function(test) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [ { ELEMENT: '0' } ]
      })
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: 'hp vasq',
        state : 'success'
      });

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq"');
      test.done();
    })
  },

  'test expect element to have attribute equal to [FAILED]' : function(test) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [ { ELEMENT: '0' } ]
      })
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: 'hp vasq',
        state : 'success'
      });

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

  'test expect element to have attribute NOT equal to [PASSED]' : function(test) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [ { ELEMENT: '0' } ]
      })
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: 'hp vasq',
        state : 'success'
      });

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.equal('xx');
    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, null);
      test.equals(expect.assertion.negate, true);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.resultValue, 'hp vasq');
      test.deepEqual(expect.assertion.messageParts, [ ' not equal to', ': "', 'xx', '"' ]);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not equal to: "xx"');
      test.done();
    })
  },

  'test expect element to have attribute NOT equal to [FAILED]' : function(test) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [ { ELEMENT: '0' } ]
      })
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: 'hp vasq',
        state : 'success'
      });

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

  'test expect element to have attribute equal with waitFor [PASSED]' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    var mock = nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [ { ELEMENT: '0' } ]
      });

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(110);
    mock
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: null,
        state : 'success'
      })
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: 'hp vasq',
        state : 'success'
      });

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 110);
      test.equals(expect.assertion.passed, true);
      test.equals(expect.assertion.retries, 1);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
      test.done();
    })
  },

  'test expect element to have attribute equal and waitFor [FAILED] - attribute not found' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 50;
    var mock = nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [ { ELEMENT: '0' } ]
      });

    var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(110);
    mock
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: null,
        state : 'success'
      })
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: null,
        state : 'success'
      });

    this.client.on('nightwatch:finished', function(results, errors) {
      test.equals(expect.assertion.waitForMs, 110);
      test.equals(expect.assertion.passed, false);
      test.ok(expect.assertion.retries > 1);
      test.equals(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 110ms - attribute was not found');
      test.done();
    })
  },

  'test expect element to have attribute equal and waitFor [FAILED] - attribute not equal' : function(test) {
    this.client.api.globals.waitForConditionPollInterval = 10;
    var mock = nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [ { ELEMENT: '0' } ]
      })
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: 'xx',
        state : 'success'
      })
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: 'xx',
        state : 'success'
      });

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

  'test expect element to have attribute equal to - element not found' : function(test) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: []
      });

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

  'test expect element to have attribute contains - element not found' : function(test) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: []
      });

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

  'test expect element to have attribute match - element not found' : function(test) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: []
      });

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

  'test expect element to have attribute match throws' : function(test) {
    test.throws(function() {
      this.client.api.expect.element('#weblogin').to.have.attribute('class').which.matches('');
    }.bind(this));

    test.done();
  },

  tearDown : function(callback) {
    this.client = null;

    // clean up
    callback();
  }
};
