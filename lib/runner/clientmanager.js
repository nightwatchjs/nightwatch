var util = require('util');
var events = require('events');
var Q = require('q');
var Nightwatch = require('../../index.js');

function ClientManager() {
  events.EventEmitter.call(this);
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
    self.options.report_prefix = this.api.capabilities.browserName.toUpperCase() +
    '_' + this.api.capabilities.version +
    '_' + this.api.capabilities.platform + '_';
  });
};

ClientManager.prototype.start = function() {

  var self = this;
  this['@client'].once('nightwatch:finished', function(results, errors) {
    self.emit('complete', results, errors);
  });

  this['@client'].once('error', function(data, error) {
    var result = {message: '\nConnection refused! Is selenium server started?\n', data : error};
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

ClientManager.prototype.results = function(type, value) {
  if (typeof value == 'undefined') {
    return this['@client'].results[type] || 0;
  }
  this['@client'].results[type] = value;
  return this;
};

ClientManager.prototype.terminated = function() {
  return this['@client'].terminated;
};

ClientManager.prototype.print = function(startTime) {
  return this['@client'].printResult.call(this['@client'], startTime);
};

ClientManager.prototype.api = function(key, value) {
  if (key && (typeof value != 'undefined')) {
    this['@client'].api[key] = value;
  }
  return this['@client'].api;
};

ClientManager.prototype.restartQueue = function(onComplete) {
  this['@client'].queue.reset();
  this['@client'].queue.run(onComplete);
};

ClientManager.prototype.shouldRestartQueue = function() {
  return this['@client'] && this['@client'].queue.list().length;
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

module.exports = ClientManager;
