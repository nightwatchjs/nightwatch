var util = require('util');
var events = require('events');
var Q = require('q');
var Nightwatch = require('../index.js');

function ClientManager() {
  events.EventEmitter.call(this);
  this.setMaxListeners(0);
}

util.inherits(ClientManager, events.EventEmitter);

ClientManager.prototype.init = function(opts) {
  try {
    this['@client'] = Nightwatch.client(opts);
  } catch (err) {
    console.log(err.stack);
    this.emit('error', err, false);
    return;
  }

  var self = this;
  this.options = opts;

  this['@client'].once('selenium:session_create', function() {
    var capabilities = this.api.capabilities || {};
    var browserName = (capabilities.browserName && capabilities.browserName.toUpperCase()) || '';

    self.options.report_prefix = browserName + '_' + this.api.capabilities.version + '_' + this.api.capabilities.platform + '_';
  });
  return this;
};

ClientManager.prototype.start = function(done) {
  var self = this;

  this.resetTerminated();

  this['@client'].once('nightwatch:finished', function(results, errors) {
    self.emit('complete', results, errors);
    if (done) {
      if (results.failed > 0 || results.errors > 0) {
        done(results.lastError);
        results.lastError = null;
      } else {
        done();
      }
    }
  });

  this['@client'].once('error', function(error, data) {
    var result = {
      message: 'Connection refused! Is selenium server started?\n',
      data : error || data
    };

    self.emit('error', result, false);
  });

  this['@client'].start();

  return this;
};

ClientManager.prototype.get = function() {
  return this['@client'];
};

ClientManager.prototype.set = function(prop, value) {
  this['@client'][prop] = value;
  return this;
};

ClientManager.prototype.publishTestResults = function(testcase, results) {
  if (!this['@client'].api.currentTest) {
    return this;
  }

  results = results || {};

  var currentTestSuite = this['@client'].api.currentTest.results;

  currentTestSuite.passed += results.passed;
  currentTestSuite.failed += results.failed;
  currentTestSuite.errors += results.errors;
  currentTestSuite.skipped += results.skipped;
  currentTestSuite.tests += results.tests.length;

  currentTestSuite.testcases = currentTestSuite.testcases || {};
  currentTestSuite.testcases[testcase] = {
    passed : results.passed,
    failed : results.failed,
    errors : results.errors,
    skipped : results.skipped,
    tests : results.tests.length,
    assertions : results.tests,
    stackTrace : results.stackTrace
  };

  return this;
};

ClientManager.prototype.results = function(type, value) {
  if (typeof value == 'undefined' && typeof type == 'undefined') {
    return this['@client'].results;
  }

  if (typeof value == 'undefined') {
    return this['@client'].results[type] || 0;
  }
  this['@client'].results[type] = value;
  return this;
};

ClientManager.prototype.errors = function() {
  return this['@client'].errors;
};

ClientManager.prototype.handleException = function(err) {
  return this['@client'].handleException(err);
};

ClientManager.prototype.clearGlobalResult = function() {
  return this['@client'].clearResult();
};

ClientManager.prototype.terminated = function() {
  return this['@client'].terminated;
};

ClientManager.prototype.terminate = function() {
  this['@client'].terminate();
  return this;
};


ClientManager.prototype.resetTerminated = function() {
  this['@client'].resetTerminated();
  return this;
};

ClientManager.prototype.print = function(startTime) {
  return this['@client'].printResult(startTime);
};

ClientManager.prototype.api = function(key, value) {
  if (key && (typeof value != 'undefined')) {
    this['@client'].api[key] = value;
  }
  return this['@client'].api;
};

ClientManager.prototype.globals = function(key, value) {
  if (key) {
    if (typeof value != 'undefined') {
      this['@client'].api.globals[key] = value;
      return this;
    }

    return this['@client'].api.globals[key];
  }

  return this['@client'].api.globals;
};

ClientManager.prototype.resetQueue = function() {
  this['@client'].queue.reset();
  return this;
};

ClientManager.prototype.restartQueue = function(onComplete) {
  this.resetQueue();
  this['@client'].queue.run(onComplete);
};

ClientManager.prototype.shouldRestartQueue = function() {
  return this['@client'] && this['@client'].queue.list().length > 0;
};

ClientManager.prototype.checkQueue = function() {
  var deferred = Q.defer();
  if (this.shouldRestartQueue()) {
    this.restartQueue(function() {
      deferred.resolve();
    });
  } else {
    deferred.resolve();
  }

  return deferred.promise;
};

ClientManager.prototype.endSessionOnFail = function(value) {
  if (typeof value == 'undefined') {
    return this['@client'].endSessionOnFail();
  }
  this['@client'].endSessionOnFail(value);

  return this;
};

ClientManager.prototype.skipTestcasesOnFail = function() {
  return this.api().options.skip_testcases_on_fail;
};

module.exports = ClientManager;
