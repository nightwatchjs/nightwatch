var assert = require('assert');
var ExpectGlobals = require('../../../lib/globals/expect.js');
var Nocks = require('../../../lib/nocks.js');

module.exports = {
  'expect.css' : {
    beforeEach: function (done) {
      ExpectGlobals.beforeEach.call(this, done);
    },

    afterEach : function() {
      ExpectGlobals.afterEach.call(this);
    },

    'to have css property [PASSED]': function (done) {
      Nocks.elementFound().cssProperty('block');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display');

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.cssProperty, 'display');
        assert.equal(expect.assertion.resultValue, 'block');
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display"');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 0);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to have css property "display"');
        done();
      });
      this.client.start();
    },

    'to have css property with waitFor [PASSED]': function (done) {
      Nocks.elementFound().cssProperty('block');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').before(100);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 100);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" in 100ms - property was present in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });
      this.client.start();
    },

    'to have css property with waitFor [FAILED]': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementFound().cssProperty('', 3);

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" in 60ms');
        done();
      });
      this.client.start();
    },

    'to have css property with message [PASSED]': function (done) {
      Nocks.elementFound().cssProperty('block');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Testing if #weblogin has display');
        done();
      });
      this.client.start();
    },

    'to have css property with message [FAILED]': function (done) {
      Nocks.elementFound().cssProperty('');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display');

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Testing if #weblogin has display');
        done();
      });

      this.client.start();
    },

    'to have css property [FAILED]': function (done) {
      Nocks.elementFound().cssProperty('');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'present');
        assert.equal(expect.assertion.actual, 'not present');
        assert.equal(expect.assertion.cssProperty, 'display');
        assert.equal(expect.assertion.resultValue, '');
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display"');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to have css property "display"');
        done();
      });
      this.client.start();
    },

    'to not have css property [PASSED]': function (done) {
      Nocks.elementFound().cssProperty('');

      var expect = this.client.api.expect.element('#weblogin').to.not.have.css('display');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.expected, 'not present');
        assert.equal(expect.assertion.actual, 'not present');
        assert.equal(expect.assertion.resultValue, '');
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not have css property "display"');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 0);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to not have css property "display"');
        done();
      });
      this.client.start();
    },

    'to not have css property [FAILED]': function (done) {
      Nocks.elementFound().cssProperty('x');

      var expect = this.client.api.expect.element('#weblogin').to.not.have.css('display');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'not present');
        assert.equal(expect.assertion.actual, 'present');
        assert.equal(expect.assertion.resultValue, 'x');
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not have css property "display"');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to not have css property "display"');
        done();
      });
      this.client.start();
    },


    'to have css property - element not found': function (done) {
      Nocks.elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'present');
        assert.equal(expect.assertion.actual, 'not present');
        assert.equal(expect.assertion.resultValue, null);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" - element was not found');
        assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to have css property "display" - element was not found');
        done();
      });
      this.client.start();
    },

    'to have css property equal to [PASSED]': function (done) {
      Nocks.elementFound().cssProperty('block');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('block');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" equal to: "block"');
        done();
      });
      this.client.start();
    },

    'to have css property which equals [PASSED]': function (done) {
      Nocks.elementFound().cssProperty('block');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.equals('block');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" which equals: "block"');
        done();
      });
      this.client.start();
    },

    'to have css property equal to [FAILED]': function (done) {
      Nocks.elementFound().cssProperty('block');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('b');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'equal to \'b\'');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.actual, 'block');
        assert.equal(expect.assertion.resultValue, 'block');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' equal to', ': "', 'b', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" equal to: "b"');
        done();
      });
      this.client.start();
    },

    'to have css property NOT equal to [PASSED]': function (done) {
      Nocks.elementFound().cssProperty('block');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.equal('xx');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.resultValue, 'block');
        assert.deepEqual(expect.assertion.messageParts, [' not equal to', ': "', 'xx', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" not equal to: "xx"');
        done();
      });
      this.client.start();
    },

    'to have css property NOT equal to [FAILED]': function (done) {
      Nocks.elementFound().cssProperty('block');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.equal('block');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not equal to \'block\'');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.actual, 'block');
        assert.equal(expect.assertion.resultValue, 'block');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' not equal to', ': "', 'block', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" not equal to: "block"');
        done();
      });
      this.client.start();
    },

    'to have css property equal with waitFor [PASSED]': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;
      Nocks.elementFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('block').before(110);
      Nocks.cssProperty('').cssProperty('block');

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 110);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.retries, 1);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" equal to: "block" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });
      this.client.start();
    },

    'to have css property equal and waitFor [FAILED] - property not set': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;
      Nocks.elementFound().cssProperty('', 3);

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('block').before(120);

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 120);
        assert.equal(expect.assertion.passed, false);
        assert.ok(expect.assertion.retries > 1);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" equal to: "block" in 120ms');
        done();
      });
      this.client.start();
    },

    'to have css property equal and waitFor [FAILED] - property not equal': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 10;
      Nocks.elementFound().cssProperty('xx', 3);

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('block').before(20);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 20);
        assert.equal(expect.assertion.passed, false);
        assert.ok(expect.assertion.retries >= 1);
        assert.ok(expect.assertion.elapsedTime >= 20);
        assert.equal(expect.assertion.expected, 'equal to \'block\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" equal to: "block" in 20ms');
        done();
      });
      this.client.start();
    },


    'to have css property which contains [PASSED]': function (done) {
      Nocks.elementFound().cssProperty('block');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.contains('block');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'contains \'block\'');
        assert.equal(expect.assertion.actual, 'block');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.resultValue, 'block');
        assert.equal(expect.assertion.passed, true);
        assert.deepEqual(expect.assertion.messageParts, [' which ', 'contains', ': "', 'block', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" which contains: "block"');
        done();
      });
      this.client.start();
    },
    'to have css property equal with message [PASSED]': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 200;
      Nocks.elementFound().cssProperty('block');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display which equals block').equal('block');

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.actual, 'block');
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Testing if #weblogin has display which equals block');
        done();
      });
      this.client.start();
    },

    'to have css property equal with message [FAILED] - property not set': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;
      Nocks.elementFound().cssProperty('');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display which equals block').equal('block');

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Testing if #weblogin has display which equals block');
        done();
      });
      this.client.start();
    },

    'to have css property equal with message [FAILED] - property not equal': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 10;
      Nocks.elementFound().cssProperty('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display which equals block').equal('block');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.message, 'Testing if #weblogin has display which equals block');
        done();
      });
      this.client.start();
    },

    'to have css property not contains [PASSED]': function (done) {
      Nocks.elementFound().cssProperty('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.contains('vasq');

      assert.equal(expect.assertion.message, 'Expected element <%s> to have css property "display"');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not contain \'vasq\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.resultValue, 'xx');
        assert.equal(expect.assertion.passed, true);
        assert.deepEqual(expect.assertion.messageParts, [' not contain', ': "', 'vasq', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" not contain: "vasq"');
        done();
      });
      this.client.start();
    },

    'to have css property not contains [FAILED]': function (done) {
      Nocks.elementFound().cssProperty('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.contains('xx');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not contain \'xx\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.resultValue, 'xx');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' not contain', ': "', 'xx', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" not contain: "xx"');
        done();
      });
      this.client.start();
    },

    'to have css property which matches [PASSED]': function (done) {
      Nocks.elementFound().cssProperty('block');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.matches(/block/);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'matches \'/block/\'');
        assert.equal(expect.assertion.actual, 'block');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.resultValue, 'block');
        assert.equal(expect.assertion.passed, true);
        assert.deepEqual(expect.assertion.messageParts, [' which ', 'matches', ': "', /block/, '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" which matches: "/block/"');
        done();
      });
      this.client.start();
    },

    'to have css property not match [PASSED]': function (done) {
      Nocks.elementFound().cssProperty('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.match(/vasq/);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not match \'/vasq/\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.resultValue, 'xx');
        assert.equal(expect.assertion.passed, true);
        assert.deepEqual(expect.assertion.messageParts, [' not match', ': "', /vasq/, '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" not match: "/vasq/"');
        done();
      });
      this.client.start();
    },

    'to have css property not match [FAILED]': function (done) {
      Nocks.elementFound().cssProperty('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.match(/xx/);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not match \'/xx/\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.resultValue, 'xx');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' not match', ': "', /xx/, '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" not match: "/xx/"');
        done();
      });
      this.client.start();
    },

    'to have css property equal to - element not found': function (done) {
      Nocks.elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('vasq');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'present');
        assert.equal(expect.assertion.actual, 'not present');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.resultValue, null);
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' equal to', ': "', 'vasq', '"', ' - element was not found']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" equal to: "vasq" - element was not found');
        done();
      });
      this.client.start();
    },

    'to have css property contains - element not found': function (done) {
      Nocks.elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.contains('vasq');

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'present');
        assert.equal(expect.assertion.actual, 'not present');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' which ', 'contains', ': "', 'vasq', '"', ' - element was not found']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" which contains: "vasq" - element was not found');
        done();
      });
      this.client.start();
    },

    'to have css property with waitFor - element not found': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound().elementNotFound().elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" in 60ms - element was not found');
        done();
      });
      this.client.start();
    },

    'to have css property with waitFor - element found on retry': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound().elementFound().cssProperty('block');

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" in 60ms - property was present in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });
      this.client.start();
    },

    'to have css property match - element not found': function (done) {
      Nocks.elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.matches(/vasq$/);

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'present');
        assert.equal(expect.assertion.actual, 'not present');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' which ', 'matches', ': "', /vasq$/, '"', ' - element was not found']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have css property "display" which matches: "/vasq$/" - element was not found');
        done();
      });

      this.client.start();
    }
  }
};
