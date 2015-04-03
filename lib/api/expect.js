var util = require('util');
var events = require('events');
var chai = require('chai');
var expect = require('chai').expect;
var Q = require('q');
var chaiAsPromised = require('chai-as-promised');
var Assertion = require('../core/assertion.js');

chai.use(chaiAsPromised);

function Expect() {
  events.EventEmitter.call(this);
}
util.inherits(Expect, events.EventEmitter);

Expect.prototype.command = function(selector) {
  this.selector = selector;
  this.locator = 'css selector';
  this.deferred = Q.defer();
  this.Protocol = require('./protocol.js')(this.client.api);

  return expect(this.locate().done(function() {
    this.emit('complete');
  }).bind(this));
};

Expect.prototype.locate = function() {
  this.Protocol.element(this.locator, this.selector, function(result) {
    if (result.status === 0) {
      this.deferred.resolve(result.value);
    } else {
      this.deferred.reject(result.value);
    }
  }.bind(this));

  return this.promise();
};

Expect.prototype.promise = function() {
  return this.deferred.promise;
};

module.exports = Expect;