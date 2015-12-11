/**
 * Thanks to https://github.com/karma-runner/karma-teamcity-reporter
 *  for message escaping.
 * @type {exports}
 */

var util = require('util');
var slice = Array.prototype.slice;
var forOwn = require('lodash.forown');

function Teamcity() {
  this.SUITE_START = '##teamcity[testSuiteStarted name="%s"]';
  this.SUITE_END = '##teamcity[testSuiteFinished name="%s"]';
  this.TEST_IGNORED = '##teamcity[testIgnored name="%s"]';
  this.TEST_START = '##teamcity[testStarted name="%s"]';
  this.TEST_FAILED = '##teamcity[testFailed name="%s" message="FAILED" details="%s"]';
  this.TEST_END = '##teamcity[testFinished name="%s" duration="%s"]';
  this.BLOCK_OPENED = '##teamcity[blockOpened name="%s"]';
  this.BLOCK_CLOSED = '##teamcity[blockClosed name="%s"]';
}

Teamcity.prototype.escapeMessage = function(message) {
  if (message === null || message === undefined) {
    return '';
  }

  return message.toString()
    .replace(/\|/g, '||')
    .replace(/\'/g, '|\'')
    .replace(/\n/g, '|n')
    .replace(/\r/g, '|r')
    .replace(/\u0085/g, '|x')
    .replace(/\u2028/g, '|l')
    .replace(/\u2029/g, '|p')
    .replace(/\[/g, '|[')
    .replace(/\]/g, '|]');
};

Teamcity.prototype.formatMessage = function() {
  var args = slice.call(arguments);

  for (var i = args.length - 1; i > 0; i--) {
    args[i] = this.escapeMessage(args[i]);
  }
  return util.format.apply(null, args);
};

Teamcity.prototype.writeMessage = function() {
  var args = slice.call(arguments);

  console.log(this.formatMessage.apply(this, args));
};

Teamcity.prototype.startSuite = function(name) {
  this.writeMessage(this.SUITE_START, name);
};

Teamcity.prototype.endSuite = function(name) {
  this.writeMessage(this.SUITE_END, name);
};

Teamcity.prototype.testIgnored = function(name) {
  this.writeMessage(this.TEST_IGNORED, name);
};

Teamcity.prototype.testStart = function(name) {
  this.writeMessage(this.TEST_START, name);
};

Teamcity.prototype.testFailed = function(name, details) {
  this.writeMessage(this.TEST_FAILED, name, details);
};

Teamcity.prototype.testEnd = function(name, time) {
  this.writeMessage(this.TEST_END, name, time);
};

Teamcity.prototype.blockOpened = function(name) {
  this.writeMessage(this.BLOCK_OPENED, name);
};

Teamcity.prototype.blockClosed = function(name) {
  this.writeMessage(this.BLOCK_CLOSED, name);
};

Teamcity.prototype.write = function(results, options, callback) {

  // Each module is a block
  forOwn(results.modules, function(module, name) {
    var skipped;
    this.blockOpened(name);

    // Log skipped tests
    for (var i = 0; i < module.skipped.length; i++) {
      this.testIgnored(module.skipped[i]);
    }

    // Each collection of tests is a suite
    forOwn(module.completed, function(test, testName) {
      var assert;
      this.startSuite(testName);

      // Log each assertion as a test
      for (var i = 0; i < test.assertions.length; i++) {
        assert = test.assertions[i];
        this.testStart(assert.message);

        if (assert.failed) {
          this.testFailed(assert.message, assert.stacktrace);
        }

        // Use the total test time
        // Assertions aren't timed individually
        this.testEnd(assert.message, test.time);
      }

      this.endSuite(testName);
    }, this);

    this.blockClosed(name);
  }, this);
  callback();
};

module.exports = new Teamcity();
