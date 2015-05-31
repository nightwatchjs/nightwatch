module.exports = {
  demoTest : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .end();
  },

  tearDown : function(callback) {
    var client = this.client;
    client.globals.test.deepEqual(this.results.passed, 1);
    client.globals.test.deepEqual(this.results.failed, 1);
    client.globals.test.deepEqual(this.results.errors, 0);
    client.globals.test.deepEqual(this.results.skipped, 0);
    client.globals.test.ok(this.results.tests.length, 2);
    callback();
  }
};
