var assert = require('assert');
var ExpectGlobals = require('../../../lib/globals/expect.js');
var Nocks = require('../../../lib/nocks.js');

module.exports = {
  'expect.value' : {
    beforeEach: function (done) {
      ExpectGlobals.beforeEach.call(this, done);
    },

    afterEach : function() {
      ExpectGlobals.afterEach.call(this);
    },

    'to have value equal to [PASSED]': function (done) {
      Nocks.elementFound().value('hp vasq');
      var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "hp vasq"');
        done();
      });

      this.client.start();
    },

    'to have value which equals [PASSED]': function (done) {
      Nocks.elementFound().value('hp vasq');
      var expect = this.client.api.expect.element('#weblogin').to.have.value.which.equals('hp vasq');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value which equals: "hp vasq"');
        done();
      });

      this.client.start();
    },

    'to have value equal to [FAILED]': function (done) {
      Nocks.elementFound().value('hp vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('vasq');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'equal to \'vasq\'');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.actual, 'hp vasq');
        assert.equal(expect.assertion.resultValue, 'hp vasq');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' equal to', ': "', 'vasq', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "vasq"');
        done();
      });

      this.client.start();
    },

    'to have value NOT equal to [PASSED]': function (done) {
      Nocks.elementFound().value('hp vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('xx');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, null);
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.resultValue, 'hp vasq');
        assert.deepEqual(expect.assertion.messageParts, [' not equal to', ': "', 'xx', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value not equal to: "xx"');
        done();
      });

      this.client.start();
    },

    'to have value NOT equal to [FAILED]': function (done) {
      Nocks.elementFound().value('hp vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('hp vasq');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not equal to \'hp vasq\'');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.actual, 'hp vasq');
        assert.equal(expect.assertion.resultValue, 'hp vasq');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' not equal to', ': "', 'hp vasq', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value not equal to: "hp vasq"');
        done();
      });

      this.client.start();
    },

    'to have value equal with waitFor [PASSED]': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;
      Nocks.elementFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);
      Nocks.value(null).value('hp vasq');

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 110);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.retries, 1);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });

      this.client.start();
    },

    'to have value equal and waitFor [FAILED] - value not equal': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementFound().value('xx', 3);

      var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 110);
        assert.equal(expect.assertion.passed, false);
        assert.ok(expect.assertion.retries >= 1);
        assert.ok(expect.assertion.elapsedTime >= 110);
        assert.equal(expect.assertion.expected, 'equal to \'hp vasq\'');
        //assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms');
        done();
      });

      this.client.start();
    },

    'to have value not equal to [PASSED]': function (done) {
      Nocks.elementFound().value('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('vasq');
      assert.equal(expect.assertion.message, 'Expected element <%s> to have value');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not equal to \'vasq\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.resultValue, 'xx');
        assert.equal(expect.assertion.passed, true);
        assert.deepEqual(expect.assertion.messageParts, [' not equal to', ': "', 'vasq', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value not equal to: "vasq"');
        done();
      });

      this.client.start();
    },

    'to have value not equal to [FAILED]': function (done) {
      Nocks.elementFound().value('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.value.not.equal('xx');
      assert.equal(expect.assertion.message, 'Expected element <%s> to have value');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not equal to \'xx\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.resultValue, 'xx');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' not equal to', ': "', 'xx', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value not equal to: "xx"');
        done();
      });

      this.client.start();
    },

    'to have value not contains [PASSED]': function (done) {
      Nocks.elementFound().value('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.value.not.contains('vasq');

      assert.equal(expect.assertion.message, 'Expected element <%s> to have value');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not contain \'vasq\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.resultValue, 'xx');
        assert.equal(expect.assertion.passed, true);
        assert.deepEqual(expect.assertion.messageParts, [' not contain', ': "', 'vasq', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value not contain: "vasq"');
        done();
      });

      this.client.start();
    },

    'to have value contains [PASSED]': function (done) {
      Nocks.elementFound().value('vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.value.which.contains('vasq');

      assert.equal(expect.assertion.message, 'Expected element <%s> to have value');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'contains \'vasq\'');
        assert.equal(expect.assertion.actual, 'vasq');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.resultValue, 'vasq');
        assert.equal(expect.assertion.passed, true);
        assert.deepEqual(expect.assertion.messageParts, [' which ', 'contains', ': "', 'vasq', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value which contains: "vasq"');
        done();
      });

      this.client.start();
    },

    'to have value not contains [FAILED]': function (done) {
      Nocks.elementFound().value('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.value.not.contains('xx');
      assert.equal(expect.assertion.message, 'Expected element <%s> to have value');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not contain \'xx\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.resultValue, 'xx');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' not contain', ': "', 'xx', '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value not contain: "xx"');
        done();
      });

      this.client.start();
    },

    'to have value not match [PASSED]': function (done) {
      Nocks.elementFound().value('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.value.not.match(/vasq/);

      assert.equal(expect.assertion.message, 'Expected element <%s> to have value');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not match \'/vasq/\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.resultValue, 'xx');
        assert.equal(expect.assertion.passed, true);
        assert.deepEqual(expect.assertion.messageParts, [' not match', ': "', /vasq/, '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value not match: "/vasq/"');
        done();
      });

      this.client.start();
    },

    'to have value which matches [PASSED]': function (done) {
      Nocks.elementFound().value('vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.value.which.matches(/vasq/);

      assert.equal(expect.assertion.message, 'Expected element <%s> to have value');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'matches \'/vasq/\'');
        assert.equal(expect.assertion.actual, 'vasq');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.resultValue, 'vasq');
        assert.equal(expect.assertion.passed, true);
        assert.deepEqual(expect.assertion.messageParts, [' which ', 'matches', ': "', /vasq/, '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value which matches: "/vasq/"');
        done();
      });

      this.client.start();
    },

    'to have value not match [FAILED]': function (done) {
      Nocks.elementFound().value('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.value.not.match(/xx/);
      assert.equal(expect.assertion.message, 'Expected element <%s> to have value');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'not match \'/xx/\'');
        assert.equal(expect.assertion.actual, 'xx');
        assert.equal(expect.assertion.negate, true);
        assert.equal(expect.assertion.resultValue, 'xx');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' not match', ': "', /xx/, '"']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value not match: "/xx/"');
        done();
      });

      this.client.start();
    },

    'to have value equal to - element not found': function (done) {
      Nocks.elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('vasq');
      assert.equal(expect.assertion.message, 'Expected element <%s> to have value');
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'present');
        assert.equal(expect.assertion.actual, 'not present');
        assert.equal(expect.assertion.negate, false);
        assert.equal(expect.assertion.resultValue, null);
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' equal to', ': "', 'vasq', '"', ' - element was not found']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "vasq" - element was not found');
        done();
      });

      this.client.start();
    },

    'to have value which contains - element not found': function (done) {
      Nocks.elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.value.which.contains('vasq');

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'present');
        assert.equal(expect.assertion.actual, 'not present');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' which ', 'contains', ': "', 'vasq', '"', ' - element was not found']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value which contains: "vasq" - element was not found');
        done();
      });

      this.client.start();
    },

    'to have value match - element not found': function (done) {
      Nocks.elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.value.which.matches(/vasq$/);

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.expected, 'present');
        assert.equal(expect.assertion.actual, 'not present');
        assert.equal(expect.assertion.passed, false);
        assert.deepEqual(expect.assertion.messageParts, [' which ', 'matches', ': "', /vasq$/, '"', ' - element was not found']);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value which matches: "/vasq$/" - element was not found');
        done();
      });

      this.client.start();
    },

    'to have value equal to with waitFor - element not found': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;

      Nocks.elementNotFound().elementNotFound().elementNotFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(60);
      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 60);
        assert.equal(expect.assertion.passed, false);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "hp vasq" in 60ms - element was not found');
        done();
      });

      this.client.start();
    },

    'to have value equal with waitFor - element found on retry': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;
      Nocks.elementNotFound().elementFound().value('hp vasq');

      var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 110);
        assert.equal(expect.assertion.passed, true);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms');
        done();
      });

      this.client.start();
    },

    'to have value match - throws exception on invalid regex': function (done) {
      Nocks.elementFound().value('xx');

      var expect = this.client.api.expect.element('#weblogin').to.have.value;
      assert.throws(function () {
        expect.which.matches('');
      }.bind(this));

      this.client.once('nightwatch:finished', function (results, errors) {
        done();
      });

      this.client.start();
    },

    'to have value equal and waitFor [FAILED] - value not found': function (done) {
      this.client.api.globals.waitForConditionPollInterval = 50;
      Nocks.elementFound();

      var expect = this.client.api.expect.element('#weblogin').to.have.value.equal('hp vasq').before(110);

      Nocks.elementFound().value('xx', 4);

      this.client.once('nightwatch:finished', function (results, errors) {
        assert.equal(expect.assertion.waitForMs, 110);
        assert.equal(expect.assertion.passed, false);
        assert.ok(expect.assertion.retries > 1);
        assert.equal(expect.assertion.message, 'Expected element <#weblogin> to have value equal to: "hp vasq" in 110ms');
        done();
      });

      this.client.start();
    }
  }
};
