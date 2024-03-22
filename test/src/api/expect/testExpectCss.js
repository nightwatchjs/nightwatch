const assert = require('assert');
const ExpectGlobals = require('../../../lib/globals/expect.js');
const Nocks = require('../../../lib/nocks.js');

describe('expect.css', function() {
  beforeEach(function(done) {
    ExpectGlobals.beforeEach.call(this, () => {
      this.client.api.globals.abortOnAssertionFailure = false;
      done();
    });
  });

  afterEach(function(done) {
    ExpectGlobals.afterEach.call(this, done);
  });

  it('to have css property [PASSED]', function() {
    Nocks.elementFound().cssProperty('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.cssProperty, 'display');
      assert.strictEqual(expect.assertion.resultValue, 'block');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display"'));
      assert.strictEqual(expect.assertion.messageParts.length, 1);
    });
  });

  it('to have css property with waitFor [PASSED]', function() {
    Nocks.elementFound().cssProperty('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').before(100);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 100);
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" in 100ms (' + expect.assertion.elapsedTime + 'ms)'));
    });
  });

  it('to have css property with waitFor [FAILED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 15;
    this.client.api.globals.waitForConditionTimeout = 50;

    Nocks.elementFound().cssProperty('', 4);

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').before(40);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.passed, false, 'Assertion should fail');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" in 40ms'));
    });
  });

  it('to have css property with message [PASSED]', function() {
    Nocks.elementFound().cssProperty('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.includes('Testing if #weblogin has display'));
    });
  });

  it('to have css property with message [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .cssProperty('')
      .cssProperty('')
      .cssProperty('');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display');

    this.client.api.perform(function() {
      assert.strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.includes('Testing if #weblogin has display'));
    });

    return this.client.start();
  });

  it('to have css property [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .cssProperty('')
      .cssProperty('')
      .cssProperty('');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.waitForMs, 40);
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.expected, 'present');
      assert.strictEqual(expect.assertion.actual, 'not present');
      assert.strictEqual(expect.assertion.cssProperty, 'display');
      assert.strictEqual(expect.assertion.resultValue, '');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display"'));
      assert.strictEqual(expect.assertion.messageParts.length, 2);
    });
  });

  it('to not have css property [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .cssProperty('')
      .cssProperty('')
      .cssProperty('');

    let expect = this.client.api.expect.element('#weblogin').to.not.have.css('display');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, true);
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.expected, 'not present');
      assert.strictEqual(expect.assertion.actual, 'not present');
      assert.strictEqual(expect.assertion.resultValue, '');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not have css property "display"'));
      assert.strictEqual(expect.assertion.messageParts.length, 1);
    });
  });

  it('to not have css property [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .cssProperty('x')
      .cssProperty('x')
      .cssProperty('x');

    let expect = this.client.api.expect.element('#weblogin').to.not.have.css('display');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, true);
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.expected, 'not present');
      assert.strictEqual(expect.assertion.actual, 'present');
      assert.strictEqual(expect.assertion.resultValue, 'x');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to not have css property "display"'));
      assert.strictEqual(expect.assertion.messageParts.length, 2);
    });
  });

  it('to have css property - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 65;
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks
      .elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .cssProperty(null);

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.selector, '#weblogin');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.waitForMs, 65);
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.expected, 'present');
      assert.strictEqual(expect.assertion.actual, 'not present');
      assert.strictEqual(expect.assertion.resultValue, null);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" - element was not found'));
      assert.ok(expect.assertion.messageParts.includes(' - element was not found'));
    });
  });

  it('to have css property equal to [PASSED]', function() {
    Nocks.elementFound().cssProperty('block');
    this.client.api.globals.waitForConditionTimeout = 65;

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('block');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 65);
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" equal to: "block"'));
    });
  });

  it('to have css property which equals [PASSED]', function() {
    Nocks.elementFound().cssProperty('block');
    this.client.api.globals.waitForConditionTimeout = 100;

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.equals('block');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 100);
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" which equals: "block"'));
    });
  });

  it('to have css property equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .cssProperty('block')
      .cssProperty('block')
      .cssProperty('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('b');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.expected, 'equal to \'b\'');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.actual, 'block');
      assert.strictEqual(expect.assertion.resultValue, 'block');
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.messageParts[0], ' equal to: "b"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" equal to: "b"'));
    });
  });

  it('to have css property NOT equal to [PASSED]', function() {
    Nocks.elementFound().cssProperty('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.equal('xx');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.negate, true);
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.resultValue, 'block');
      assert.strictEqual(expect.assertion.messageParts[0], ' not equal to: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" not equal to: "xx"'));
    });
  });

  it('to have css property NOT equal to [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .cssProperty('block')
      .cssProperty('block')
      .cssProperty('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.equal('block');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.expected, 'not equal to \'block\'');
      assert.strictEqual(expect.assertion.negate, true);
      assert.strictEqual(expect.assertion.actual, 'block');
      assert.strictEqual(expect.assertion.resultValue, 'block');
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.messageParts[0], ' not equal to: "block"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" not equal to: "block"'));
    });
  });

  it('to have css property equal with waitFor [PASSED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('block').before(110);
    Nocks.cssProperty('').cssProperty('block');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 110);
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.retries, 1);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" equal to: "block" in 110ms (' + expect.assertion.elapsedTime + 'ms)'), expect.assertion.message);
    });
  });

  it('to have css property equal and waitFor [FAILED] - property not set', function() {
    this.client.api.globals.waitForConditionPollInterval = 100;
    Nocks.elementFound().cssProperty('', 3);

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('block').before(250);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 250);
      assert.strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries > 1);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" equal to: "block" in 250ms'));
    });
  });

  it('to have css property equal and waitFor [FAILED] - property not equal', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;
    Nocks.elementFound().cssProperty('xx', 3);

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('block').before(100);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 100);
      assert.strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.retries >= 1);
      assert.ok(expect.assertion.elapsedTime >= 100);
      assert.strictEqual(expect.assertion.expected, 'equal to \'block\'');
      assert.strictEqual(expect.assertion.actual, 'xx');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" equal to: "block" in 100ms'));
    });
  });

  it('to have css property which contains [PASSED]', function() {
    Nocks.elementFound().cssProperty('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.contains('block');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.expected, 'contains \'block\'');
      assert.strictEqual(expect.assertion.actual, 'block');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.resultValue, 'block');
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.messageParts[1], 'contains: "block"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" which contains: "block"'));
    });
  });
  it('to have css property equal with message [PASSED]', function() {
    this.client.api.globals.waitForConditionPollInterval = 200;
    Nocks.elementFound().cssProperty('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display which equals block').equal('block');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.actual, 'block');
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.includes('Testing if #weblogin has display which equals block'));
    });
  });

  it('to have css property equal with message [FAILED] - property not set', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementFound()
      .cssProperty('')
      .cssProperty('')
      .cssProperty('');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display which equals block').equal('block');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.includes('Testing if #weblogin has display which equals block'));
    });
  });

  it('to have css property equal with message [FAILED] - property not equal', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;
    Nocks.elementFound()
      .cssProperty('xx')
      .cssProperty('xx')
      .cssProperty('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display', 'Testing if #weblogin has display which equals block').equal('block');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.actual, 'xx');
      assert.ok(expect.assertion.message.includes('Testing if #weblogin has display which equals block'));
    });
  });

  it('to have css property not contains [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;
    Nocks.elementFound()
      .cssProperty('xx')
      .cssProperty('xx')
      .cssProperty('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.contains('vasq');

    assert.ok(expect.assertion.message.startsWith('Expected element %s to have css property "display"'));

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.expected, 'not contain \'vasq\'');
      assert.strictEqual(expect.assertion.actual, 'xx');
      assert.strictEqual(expect.assertion.negate, true);
      assert.strictEqual(expect.assertion.resultValue, 'xx');
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.messageParts[0], ' not contain: "vasq"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" not contain: "vasq"'));
    });
  });

  it('to have css property not contains [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;
    Nocks.elementFound()
      .cssProperty('xx')
      .cssProperty('xx')
      .cssProperty('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.contains('xx');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.expected, 'not contain \'xx\'');
      assert.strictEqual(expect.assertion.actual, 'xx');
      assert.strictEqual(expect.assertion.negate, true);
      assert.strictEqual(expect.assertion.resultValue, 'xx');
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.messageParts[0], ' not contain: "xx"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" not contain: "xx"'));
    });
  });

  it('to have css property which matches [PASSED]', function() {
    Nocks.elementFound().cssProperty('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.matches(/block/);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.expected, 'matches \'/block/\'');
      assert.strictEqual(expect.assertion.actual, 'block');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.resultValue, 'block');
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.messageParts[0], ' which ');
      assert.strictEqual(expect.assertion.messageParts[1], 'matches: "/block/"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" which matches: "/block/"'));
    });
  });

  it('to have css property not match [PASSED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;
    Nocks.elementFound()
      .cssProperty('xx')
      .cssProperty('xx')
      .cssProperty('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.match(/vasq/);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.expected, 'not match \'/vasq/\'');
      assert.strictEqual(expect.assertion.actual, 'xx');
      assert.strictEqual(expect.assertion.negate, true);
      assert.strictEqual(expect.assertion.resultValue, 'xx');
      assert.strictEqual(expect.assertion.passed, true);
      assert.strictEqual(expect.assertion.messageParts[0], ' not match: "/vasq/"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" not match: "/vasq/"'));
    });
  });

  it('to have css property not match [FAILED]', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;
    Nocks.elementFound()
      .cssProperty('xx')
      .cssProperty('xx')
      .cssProperty('xx');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').not.match(/xx/);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.expected, 'not match \'/xx/\'');
      assert.strictEqual(expect.assertion.actual, 'xx');
      assert.strictEqual(expect.assertion.negate, true);
      assert.strictEqual(expect.assertion.resultValue, 'xx');
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.messageParts[0], ' not match: "/xx/"');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" not match: "/xx/"'));
    });
  });

  it('to have css property equal to - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').equal('vasq');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.expected, 'equal to \'vasq\'');
      assert.strictEqual(expect.assertion.actual, 'not present');
      assert.strictEqual(expect.assertion.negate, false);
      assert.strictEqual(expect.assertion.resultValue, null);
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.messageParts[0], ' equal to: "vasq"');
      assert.strictEqual(expect.assertion.messageParts[1], ' - element was not found');
    });
  });

  it('to have css property contains - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.contains('vasq');

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.expected, 'contains \'vasq\'');
      assert.strictEqual(expect.assertion.actual, 'not present');
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.messageParts[0], ' which ');
      assert.strictEqual(expect.assertion.messageParts[1], 'contains: "vasq"');
      assert.strictEqual(expect.assertion.messageParts[2], ' - element was not found');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" which contains: "vasq" - element was not found'));
    });
  });

  it('to have css property with waitFor - element not found', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementNotFound().elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').before(60);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 60);
      assert.strictEqual(expect.assertion.passed, false);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" in 60ms - element was not found'));
    });
  });

  it('to have css property with waitFor - element found on retry', function() {
    this.client.api.globals.waitForConditionPollInterval = 50;

    Nocks.elementNotFound().elementFound().cssProperty('block');

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').before(60);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.waitForMs, 60);
      assert.strictEqual(expect.assertion.passed, true);
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" in 60ms (' + expect.assertion.elapsedTime + 'ms)'));
    });
  });

  it('to have css property match - element not found', function() {
    this.client.api.globals.waitForConditionTimeout = 40;
    this.client.api.globals.waitForConditionPollInterval = 20;

    Nocks.elementNotFound()
      .elementNotFound()
      .elementNotFound();

    let expect = this.client.api.expect.element('#weblogin').to.have.css('display').which.matches(/vasq$/);

    return this.client.start(function() {
      assert.strictEqual(expect.assertion.expected, 'matches \'/vasq$/\'');
      assert.strictEqual(expect.assertion.actual, 'not present');
      assert.strictEqual(expect.assertion.passed, false);
      assert.strictEqual(expect.assertion.messageParts[0], ' which ');
      assert.strictEqual(expect.assertion.messageParts[1], 'matches: "/vasq$/"');
      assert.strictEqual(expect.assertion.messageParts[2], ' - element was not found');
      assert.ok(expect.assertion.message.startsWith('Expected element <#weblogin> to have css property "display" which matches: "/vasq$/" - element was not found'));
    });
  });
});
