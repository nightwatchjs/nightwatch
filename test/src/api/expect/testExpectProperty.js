const assert = require('assert');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const Nocks = require('../../../lib/nocks.js');

describe('expect.property', function() {
  beforeEach(function(done) {
    ExpectGlobals.beforeEach.call(this, () => {
      this.client.api.globals.abortOnAssertionFailure = false;
      done();
    });
  });

  afterEach(function(done) {
    ExpectGlobals.afterEach.call(this, done);
  });

  it('to have property [PASSED]', function() {
    Nocks.elementFound().property('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display');

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.property, 'display');
      assert.equal(expect.assertion.resultValue, 'block');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display"'));
      assert.equal(expect.assertion.messageParts.length, 1);
    });
  });

  it('to have property with waitFor [PASSED]', function() {
    Nocks.elementFound().property('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').before(100);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 100);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" in 100ms - property was present in ' + expect.assertion.elapsedTime + 'ms'));
    });
  });

  it('to have property with waitFor [FAILED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 15;
    this.client.api.globals.waitForConditionTimeout = 50;

    Nocks.elementFound().property(null);
    
    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').before(40);

    return this.client.start(function() {
      assert.equal(expect.assertion.passed, false, 'Assertion should fail');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" in 40ms'));
    });
  });

  it('to have property with message [PASSED]', function() {
    Nocks.elementFound().property('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display', 'Testing if #weblogin has display');

    return this.client.start(function() {
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.includes('Testing if #weblogin has display'));
    });
  });

  it('to have property with message [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .property(null)
      .property(null)
      .property(null);

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display', 'Testing if #weblogin has display');

    this.client.api.perform(function() {
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.includes('Testing if #weblogin has display'));
    });

    return this.client.start();
  });

  it('to have property [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .property(null)
      .property(null)
      .property(null);

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display');

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 40);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'found');
      assert.equal(expect.assertion.actual, 'not found');
      assert.equal(expect.assertion.property, 'display');
      assert.equal(expect.assertion.resultValue, null);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display"'));
      assert.deepEqual(expect.assertion.messageParts, [' - property was not found']);
    });
  });

  it('to not have property [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .property(null)
      .property(null)
      .property(null);

    let expect = this.client.api.expect.element('#weblogin').to.not.have.property('display');

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.expected, 'not found');
      assert.equal(expect.assertion.actual, 'not found');
      assert.equal(expect.assertion.resultValue, null);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not have property "display"'));
      assert.deepEqual(expect.assertion.messageParts, []);
    });
  });

  it('to not have property [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .property('x')
      .property('x')
      .property('x');

    let expect = this.client.api.expect.element('#weblogin').to.not.have.property('display');

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'not found');
      assert.equal(expect.assertion.actual, 'found');
      assert.equal(expect.assertion.resultValue, 'x');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not have property "display"'));
      assert.deepEqual(expect.assertion.messageParts, []);
    });
  });

  it('to have property - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 65;
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound()
      .property(null);

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display');

    return this.client.start(function() {
      assert.equal(expect.assertion.selector, '#weblogin');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.waitForMs, 65);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.resultValue, null);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" - element was not found'));
      assert.deepEqual(expect.assertion.messageParts, [' - element was not found']);
    });
  });

  it('to have property equal to [PASSED]', function() {
    Nocks.elementFound().property('block');
    this.client.api.globals.waitForConditionTimeout = 65;

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').equal('block');

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 65);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" equal to: "block"'));
    });
  });

  it('to have property which equals [PASSED]', function() {
    Nocks.elementFound().property('block');
    this.client.api.globals.waitForConditionTimeout = 100;

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').which.equals('block');

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 100);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" which equals: "block"'));
    });
  });

  it('to have property equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .property('block')
      .property('block')
      .property('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').equal('b');

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'equal to \'b\'');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.actual, 'block');
      assert.equal(expect.assertion.resultValue, 'block');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' equal to: "b"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" equal to: "b"'));
    });
  });

  it('to have property NOT equal to [PASSED]', function() {
    Nocks.elementFound().property('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').not.equal('xx');

    return this.client.start(function() {
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.resultValue, 'block');
      assert.equal(expect.assertion.messageParts[0], ' not equal to: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" not equal to: "xx"'));
    });
  });

  it('to have property NOT equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .property('block')
      .property('block')
      .property('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').not.equal('block');

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not equal to \'block\'');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.actual, 'block');
      assert.equal(expect.assertion.resultValue, 'block');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' not equal to: "block"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" not equal to: "block"'));
    });
  });

  it('to have property equal with waitFor [PASSED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').equal('block').before(110);
    Nocks.property('').property('block');

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 110);
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.retries, 1);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" equal to: "block" in 110ms - condition was met in ' + expect.assertion.elapsedTime + 'ms'));
    });
  });

  it('to have property equal and waitFor [FAILED] - property not set', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound().property(null);

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').equal('block').before(120);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 120);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries > 1);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" equal to: "block" in 120ms'));
    });
  });

  it('to have property equal and waitFor [FAILED] - property not equal', function() {
    this.client.api.globals.waitForConditionPollInterval = 10;
    Nocks.elementFound().property('xx', 3);

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').equal('block').before(20);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 20);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries >= 1);
      assert.ok(expect.assertion.elapsedTime >= 20);
      assert.equal(expect.assertion.expected, 'equal to \'block\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" equal to: "block" in 20ms'));
    });
  });

  it('to have property which contains [PASSED]', function() {
    Nocks.elementFound().property('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').which.contains('block');

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'contains \'block\'');
      assert.equal(expect.assertion.actual, 'block');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, 'block');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[1], 'contains: "block"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" which contains: "block"'));
    });
  });
  
  it('to have property equal with message [PASSED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 200;
    Nocks.elementFound().property('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display', 'Testing if #weblogin has display which equals block').equal('block');

    return this.client.start(function() {
      assert.equal(expect.assertion.actual, 'block');
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.includes('Testing if #weblogin has display which equals block'));
    });
  });

  it('to have property equal with message [FAILED] - property not set', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .property(null)
      .property(null)
      .property(null);

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display', 'Testing if #weblogin has display which equals block').equal('block');

    return this.client.start(function() {
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.includes('Testing if #weblogin has display which equals block'));
    });
  });

  it('to have property equal with message [FAILED] - property not equal', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;
    Nocks.elementFound()
      .property('xx')
      .property('xx')
      .property('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display', 'Testing if #weblogin has display which equals block').equal('block');

    return this.client.start(function() {
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.actual, 'xx');
      assert.ok(expect.assertion.message.includes('Testing if #weblogin has display which equals block'));
    });
  });

  it('to have property not contains [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;
    Nocks.elementFound()
      .property('xx')
      .property('xx')
      .property('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').not.contains('vasq');

    assert.ok(expect.assertion.message.startsWith('Expected element <%s> to have property "display"'));

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not contain \'vasq\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not contain: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" not contain: "vasq"'));
    });
  });

  it('to have property not contains [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;
    Nocks.elementFound()
      .property('xx')
      .property('xx')
      .property('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').not.contains('xx');

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not contain \'xx\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' not contain: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" not contain: "xx"'));
    });
  });

  it('to have property which matches [PASSED]', function() {
    Nocks.elementFound().property('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').which.matches(/block/);

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'matches \'/block/\'');
      assert.equal(expect.assertion.actual, 'block');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, 'block');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' which ');
      assert.equal(expect.assertion.messageParts[1], 'matches: "/block/"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" which matches: "/block/"'));
    });
  });

  it('to have property not match [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;
    Nocks.elementFound()
      .property('xx')
      .property('xx')
      .property('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').not.match(/vasq/);

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not match \'/vasq/\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, true);
      assert.equal(expect.assertion.messageParts[0], ' not match: "/vasq/"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" not match: "/vasq/"'));
    });
  });

  it('to have property not match [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;
    Nocks.elementFound()
      .property('xx')
      .property('xx')
      .property('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').not.match(/xx/);

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'not match \'/xx/\'');
      assert.equal(expect.assertion.actual, 'xx');
      assert.equal(expect.assertion.negate, true);
      assert.equal(expect.assertion.resultValue, 'xx');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' not match: "/xx/"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" not match: "/xx/"'));
    });
  });

  it('to have property equal to - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').equal('vasq');

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.negate, false);
      assert.equal(expect.assertion.resultValue, null);
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' equal to: "vasq"');
      assert.equal(expect.assertion.messageParts[1], ' - element was not found');
    });
  });

  it('to have property contains - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').which.contains('vasq');

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' which ');
      assert.equal(expect.assertion.messageParts[1], 'contains: "vasq"');
      assert.equal(expect.assertion.messageParts[2], ' - element was not found');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" which contains: "vasq" - element was not found'));
    });
  });

  it('to have property with waitFor - element not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').before(60);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" in 60ms - element was not found'));
    });
  });

  it('to have property with waitFor - element found on retry', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementFound().property('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').before(60);

    return this.client.start(function() {
      assert.equal(expect.assertion.waitForMs, 60);
      assert.equal(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" in 60ms - property was present in ' + expect.assertion.elapsedTime + 'ms'));
    });
  });

  it('to have property match - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.property('display').which.matches(/vasq$/);

    return this.client.start(function() {
      assert.equal(expect.assertion.expected, 'present');
      assert.equal(expect.assertion.actual, 'not present');
      assert.equal(expect.assertion.passed, false);
      assert.equal(expect.assertion.messageParts[0], ' which ');
      assert.equal(expect.assertion.messageParts[1], 'matches: "/vasq$/"');
      assert.equal(expect.assertion.messageParts[2], ' - element was not found');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have property "display" which matches: "/vasq$/" - element was not found'));
    });
  });
});
