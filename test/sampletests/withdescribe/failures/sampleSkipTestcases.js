const assert = require('assert');

describe('sample test with skipTestcasesOnFail', function () {
  this.skipTestcasesOnFail = false;
  this.endSessionOnFail = false;

  this.waitForTimeout(10);
  this.waitForRetryInterval(5);

  this.tags = ['login'];

  assert.strictEqual(this.waitForTimeout(), 10);
  assert.strictEqual(this.waitForRetryInterval(), 5);

  assert.strictEqual(this.globals.waitForConditionTimeout, 10);
  assert.strictEqual(this.globals.retryAssertionTimeout, 10);
  assert.strictEqual(this.globals.waitForConditionPollInterval, 5);

  let endFn;

  before(function (client, done) {
    endFn = client.end;
    done();
  });

  it('demoTest', function (client) {
    client.globals.calls++;

    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement');
  });

  it('demoTest2', function (client) {
    client.globals.calls++;

    client.end = function () {
      client.assert.fail('End should not be called.');
    };

    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement');
  });

  after(function (client, done) {
    client.end = endFn;
    done();
  });
});
