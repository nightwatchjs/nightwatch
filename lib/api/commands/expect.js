var util = require('util');
var events = require('events');
var chai = require('chai');
var expect = require('chai').expect;
var Q = require('q');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

function Expect() {
  events.EventEmitter.call(this);
}
util.inherits(Expect, events.EventEmitter);

Expect.prototype.command = function(selector, cb) {
  this.selector = selector;
  this.locator = 'css selector';
  this.deferred = Q.defer();
  this.Protocol = require('../protocol.js')(this.client);

  this.cb = cb;
  this.locate()
};

Expect.prototype.locate = function() {
  this.Protocol.element(this.locator, this.selector, function(result) {
    if (result.status === 0) {
      console.log('result.status', result.value)
      this.cb(expect(this.deferred));
      this.deferred.resolve(result.value);
    } else {
      this.deferred.reject(result.value);
    }
  }.bind(this));

  this.deferred.promise.done(function() {
    this.emit('complete');
  }.bind(this));

  return this.promise();
};

Expect.prototype.promise = function() {
  return this.deferred.promise;
};

module.exports = Expect;