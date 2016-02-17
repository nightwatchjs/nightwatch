var assert = require('assert');
var Nocks = require('../../../lib/nocks.js');
var ExpectGlobals = require('../../../lib/globals/expect.js');

module.exports = {
  'expect.attribute' : {
    beforeEach: function (done) {
      ExpectGlobals.beforeEach.call(this, done);
    },

    afterEach : function() {
      ExpectGlobals.afterEach.call(this);
    },

    'to have attribute [PASSED]': function (done) {
      Nocks.elementFound().attributeValue('hp vasq');
      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');

      this.client.once('nightwatch:finished', function(results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.attribute, 'class');
        assert.equal(expect.assertion.resultValue, 'hp vasq');
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class"');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 0);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to have attribute "class"');

        done();
      });

      this.client.start();
    },

    'to have attribute with waitFor [PASSED]': function (done) {
      Nocks.elementFound().attributeValue('hp vasq');

      this.client.api.globals.abortOnAssertionFailure = false;

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(100);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 100);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.abortOnFailure, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 100ms - attribute was present in ' + expect.assertion.elapsedTime + 'ms');

        done();
      });

      this.client.start();
    },

    'to have attribute with implicit waitFor [PASSED]': function (done) {
      Nocks.elementFound().attributeValue('hp vasq');
      this.client.api.globals.abortOnAssertionFailure = false;
      this.client.api.globals.waitForConditionTimeout = 65;

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 65);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" - attribute was present in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });

      this.client.start();
    },


    'to have attribute with implicit and custom waitFor [PASSED]': function (done) {
      Nocks.elementFound().attributeValue('hp vasq');
      this.client.api.globals.abortOnAssertionFailure = false;
      this.client.api.globals.waitForConditionTimeout = 65;

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(100);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 100);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 100ms - attribute was present in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });

      this.client.start();
    },

    'to have attribute with waitFor [FAILED]': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementFound().attributeValue(null);

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.abortOnFailure, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 60ms - attribute was not found');
        done();
      });

      this.client.start();
    },

    'to have attribute with implicit and custom waitFor [FAILED]': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;
      Nocks.elementFound().attributeValue(null);
      this.client.api.globals.waitForConditionTimeout = 65;

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(100);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 100);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.abortOnFailure, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 100ms - attribute was not found');
        done();
      });

      this.client.start();
    },

    'to have attribute with message [PASSED]': function (done) {
      Nocks.elementFound().attributeValue('hp vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has "class"');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Testing if #weblogin has "class"');
        assert.equal(results.tests[0].message, 'Testing if #weblogin has "class"');
        done();
      });

      this.client.start();
    },

    'to have attribute with message [FAILED]': function (done) {

      Nocks.elementFound().attributeValue(null);

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has "class"');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Testing if #weblogin has "class" - attribute was not found');
        assert.equal(results.tests[0].message, 'Testing if #weblogin has "class" - attribute was not found');
        done();
      });

      this.client.start();
    },

    'to have attribute [FAILED]': function (done) {
      Nocks.elementFound().attributeValue(null);

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'found');
        assert.equal(expect.assertion.actual, 'not found');
        assert.equal(expect.assertion.attribute, 'class');
        assert.equal(expect.assertion.resultValue, null);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" - attribute was not found');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, [' - attribute was not found']);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to have attribute "class" - attribute was not found');
        done();
      });

      this.client.start();
    },

    'to not have attribute [PASSED]': function (done) {
      Nocks.elementFound().attributeValue(null);

      var expect = this.client.api.expect.element('#weblogin').to.not.have.attribute('class');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.expected, 'not found');
        assert.equal(expect.assertion.actual, 'not found');
        assert.equal(expect.assertion.resultValue, null);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not have attribute "class"');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 0);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to not have attribute "class"');
        done();
      });

      this.client.start();
    },

    'to not have attribute [FAILED]': function (done) {
      Nocks.elementFound().attributeValue('');

      var expect = this.client.api.expect.element('#weblogin').to.not.have.attribute('class');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'not found');
        assert.equal(expect.assertion.actual, 'found');
        assert.equal(expect.assertion.resultValue, '');
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to not have attribute "class"');
        assert.deepEqual(expect.assertion.elementResult, {ELEMENT: '0'});
        assert.deepEqual(expect.assertion.messageParts, []);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to not have attribute "class"');
        done();
      });

      this.client.start();
    },

    'to have attribute - element not found': function (done) {
      Nocks.elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.selector, '#weblogin');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.expected, 'present');
        assert.equal(expect.assertion.actual, 'not present');
        assert.equal(expect.assertion.resultValue, null);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" - element was not found');
        assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
        assert.equal(results.passed, 0);
        assert.equal(results.failed, 1);
        assert.equal(results.tests[0].message, 'Expected element <#weblogin> to have attribute "class" - element was not found');
        done();
      });

      this.client.start();
    },

    'to have attribute equal to [PASSED]': function (done) {
      Nocks.elementFound().attributeValue('hp vasq');
      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq"');
        done();
      });

      this.client.start();
    },

    'to have attribute which equals [PASSED]': function (done) {
      Nocks.elementFound().attributeValue('hp vasq');
      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.equals('hp vasq');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" which equals: "hp vasq"');
        done();
      });

      this.client.start();
    },

    'to have attribute equal to [FAILED]': function (done) {
      Nocks.elementFound().attributeValue('hp vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('vasq');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'equal to \'vasq\'');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.actual, 'hp vasq');
        assert.equal(expect.assertion.resultValue, 'hp vasq');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' equal to', ': "', 'vasq', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "vasq"');
        done();
      });

      this.client.start();
    },

    'to have attribute NOT equal to [PASSED]': function (done) {
      Nocks.elementFound().attributeValue('hp vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.equal('xx');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.actual, 'hp vasq');
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.resultValue, 'hp vasq');
        assert.deepEqual(expect.assertion.messageParts, [' not equal to', ': "', 'xx', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not equal to: "xx"');
        done();
      });

      this.client.start();
    },

    'to have attribute NOT equal to [FAILED]': function (done) {
      Nocks.elementFound().attributeValue('hp vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.equal('hp vasq');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not equal to \'hp vasq\'');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.actual, 'hp vasq');
        assert.equal(expect.assertion.resultValue, 'hp vasq');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' not equal to', ': "', 'hp vasq', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not equal to: "hp vasq"');
        done();
      });

      this.client.start();
    },

    'to have attribute equal with waitFor [PASSED]': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;
      Nocks.elementFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(110);
      Nocks.attributeValue(null).attributeValue('hp vasq');

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 110);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.retries, 1);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });

      this.client.start();
    },

    'to have attribute equal with custom waitFor [PASSED]': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;
      this.client.api.globals.waitForConditionTimeout = 100;
      Nocks.elementFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(60);
      Nocks.attributeValue(null).attributeValue('hp vasq');

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.retries, 1);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 60ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });

      this.client.start();
    },

    'to have attribute equal and waitFor [FAILED] - attribute not found': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(110);
      Nocks.attributeValue(null).attributeValue(null);

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 110);
        assert.equal(expect.assertion.passed, false);
        assert.ok(expect.assertion.retries > 1);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 110ms - attribute was not found');
        done();
      });

      this.client.start();
    },

    'to have attribute equal and custom waitFor [FAILED] - attribute not found': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 35;
      this.client.api.globals.waitForConditionTimeout = 100;
      Nocks.elementFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(60);
      Nocks.attributeValue(null).attributeValue(null);

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, false);
        assert.ok(expect.assertion.retries > 1);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 60ms - attribute was not found');
        done();
      });

      this.client.start();
    },

    'to have attribute equal and waitFor [FAILED] - attribute not equal': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 10;
      Nocks.elementFound().attributeValue('xx').attributeValue('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('hp vasq').before(11);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 11);
        assert.equal(expect.assertion.passed, false);
        assert.ok(expect.assertion.retries >= 1);
        assert.ok(expect.assertion.elapsedTime >= 11);
        assert.equal(expect.assertion.expected, 'equal to \'hp vasq\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "hp vasq" in 11ms');
        done();
      });

      this.client.start();
    },

    'to have attribute equal to with message [PASSED]': function (done) {
      Nocks.elementFound().attributeValue('hp vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has class which equals hp vasq').equal('hp vasq');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Testing if #weblogin has class which equals hp vasq');
        done();
      });

      this.client.start();
    },


    'to have attribute equal with message [FAILED] - attribute not found': function (done) {
      Nocks.elementFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has class which equals hp vasq').equal('hp vasq');

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Testing if #weblogin has class which equals hp vasq - attribute was not found');
        done();
      });

      this.client.start();
    },


    'to have attribute equal with message [FAILED] - attribute not equal': function (done) {
      Nocks.elementFound().attributeValue('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class', 'Testing if #weblogin has class which equals hp vasq').equal('hp vasq');

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.message, 'Testing if #weblogin has class which equals hp vasq');
        done();
      });

      this.client.start();
    },

    'to have attribute not contains [PASSED]': function (done) {
      Nocks.elementFound().attributeValue('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.contains('vasq');

      assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not contain \'vasq\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.resultValue, 'xx');
        assert.equal(expect.assertion.passed, true);
        assert.deepEqual(expect.assertion.messageParts, [' not contain', ': "', 'vasq', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not contain: "vasq"');
        done();
      });

      this.client.start();
    },

    'to have attribute which contains [PASSED]': function (done) {
      Nocks.elementFound().attributeValue('vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.contains('vasq');

      assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'contains \'vasq\'');
        assert.equal(expect.assertion.actual, 'vasq');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.resultValue, 'vasq');
        assert.equal(expect.assertion.passed, true);
        assert.deepEqual(expect.assertion.messageParts, [' which ', 'contains', ': "', 'vasq', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" which contains: "vasq"');
        done();
      });

      this.client.start();
    },

    'to have attribute not contains [FAILED]': function (done) {
      Nocks.elementFound().attributeValue('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.contains('xx');
      assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not contain \'xx\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.resultValue, 'xx');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' not contain', ': "', 'xx', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not contain: "xx"');
        done();
      });

      this.client.start();
    },

    'to have attribute which matches [PASSED]': function (done) {
      Nocks.elementFound().attributeValue('vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.matches(/vasq/);

      assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'matches \'/vasq/\'');
        assert.equal(expect.assertion.actual, 'vasq');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.resultValue, 'vasq');
        assert.equal(expect.assertion.passed, true);
        assert.deepEqual(expect.assertion.messageParts, [' which ', 'matches', ': "', /vasq/, '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" which matches: "/vasq/"');
        done();
      });

      this.client.start();
    },

    'to have attribute not match [PASSED]': function (done) {
      Nocks.elementFound().attributeValue('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.match(/vasq/);

      assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not match \'/vasq/\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.resultValue, 'xx');
        assert.equal(expect.assertion.passed, true);
        assert.deepEqual(expect.assertion.messageParts, [' not match', ': "', /vasq/, '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not match: "/vasq/"');
        done();
      });

      this.client.start();
    },

    'to have attribute not match [FAILED]': function (done) {
      Nocks.elementFound().attributeValue('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').not.match(/xx/);
      assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not match \'/xx/\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.resultValue, 'xx');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' not match', ': "', /xx/, '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" not match: "/xx/"');
        done();
      });

      this.client.start();
    },

    'to have attribute equal to - element not found': function (done) {
      Nocks.elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').equal('vasq');
      assert.equal(expect.assertion.message, 'Expected element <%s> to have attribute "class"');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'present');
        assert.equal(expect.assertion.actual, 'not present');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.resultValue, null);
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' equal to', ': "', 'vasq', '"', ' - element was not found']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" equal to: "vasq" - element was not found');
        done();
      });

      this.client.start();
    },

    'to have attribute contains - element not found': function (done) {
      Nocks.elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.contains('vasq');

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'present');
        assert.equal(expect.assertion.actual, 'not present');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' which ', 'contains', ': "', 'vasq', '"', ' - element was not found']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" which contains: "vasq" - element was not found');
        done();
      });

      this.client.start();
    },

    'to have attribute match - element not found': function (done) {
      Nocks.elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').which.matches(/vasq$/);

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'present');
        assert.equal(expect.assertion.actual, 'not present');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' which ', 'matches', ': "', /vasq$/, '"', ' - element was not found']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" which matches: "/vasq$/" - element was not found');
        done();
      });

      this.client.start();
    },

    'to have attribute with waitFor - element not found': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound().elementNotFound().elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 60ms - element was not found');
        done();
      });

      this.client.start();
    },

    'to have attribute with custom waitFor - element not found': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;
      this.client.api.globals.waitForConditionTimeout = 50;

      Nocks.elementNotFound().elementNotFound().elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(100);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 100);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 100ms - element was not found');
        done();
      });

      this.client.start();
    },

    'to have attribute with waitFor - element found on retry': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound().elementFound().attributeValue('hp vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(60);

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 60ms - attribute was present in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });

      this.client.start();
    },

    'to have attribute with custom waitFor - element found on retry': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;
      this.client.api.globals.waitForConditionTimeout = 60;
      Nocks.elementNotFound().elementFound().attributeValue('hp vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class').before(100);

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 100);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have attribute "class" in 100ms - attribute was present in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });

      this.client.start();
    },


    'to have attribute match - throws exception on invalid regex': function (done) {
      Nocks.elementFound().attributeValue('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.attribute('class');
      assert.throws(function () {
        expect.which.matches('');
      }.bind(this));

      this.client.once('nightwatch:finished', function (results, errors) {
        done();
      });

      this.client.start();
    }
  }
};
