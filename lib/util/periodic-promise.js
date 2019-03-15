const EventEmitter = require('events');
const Utils = require('./utils.js');
const Logger = require('./logger.js');

class PeriodicPromise extends EventEmitter {
  get rescheduleInterval() {
    return this.__rescheduleIntervalMs;
  }

  get ms() {
    return this.__timeoutMs;
  }

  get elapsedTime() {
    return new Date().getTime() - this.startTime;
  }

  get queue() {
    return this.__queue;
  }

  constructor({
    rescheduleInterval,
    timeout,
  }) {
    super();

    this.__queue = [];
    this.retries = 0;
    this.__rescheduleIntervalMs = rescheduleInterval;
    this.__timeoutMs = timeout;
  }

  queueAction(opts) {
    this.__queue.push(opts);

    return this;
  }

  async runAction({prevResult, prevQueuePromise}) {
    if (!this.queue.length) {
      return null;
    }

    const queuePromise = this.queue.shift();
    const deferred = Utils.createPromise();

    try {
      let result = await this.perform(queuePromise, {prevResult, prevQueuePromise}, deferred);

      if (queuePromise.successHandler) {
        result = await queuePromise.successHandler(result);
      }

      if (this.queue.length) {
        return await this.runAction({
          prevResult: result,
          prevQueuePromise: queuePromise
        });
      }

      return result;
    } catch (err) {
      if (queuePromise.errorHandler) {
        return queuePromise.errorHandler(err);
      }

      throw err;
    }
  }

  async perform({action, validate, isResultStale, successHandler, retryOnSuccess = false, retryOnFailure = true}, {prevResult, prevQueuePromise}, deferred) {
    let currentResult;
    try {
      // running the current action using the result from the previous action
      currentResult = await action(prevResult);

      // if the current action returns a stale reference to the previous result, re-run the previous action
      if (isResultStale && isResultStale(currentResult)) {
        const freshResult = await prevQueuePromise.action();
        currentResult = await action(freshResult);
      }
    } catch (err) {
      Logger.error(err);
      currentResult = {status: -1, err};
    }

    // validate the result and handle
    if (validate(currentResult) && !retryOnSuccess) {
      deferred.resolve(currentResult);
    } else if (retryOnFailure && this.shouldRetry()) {
      this.reschedule(arguments[0], arguments[1], deferred);
    } else {
      if (currentResult instanceof Error) {
        throw currentResult;
      }

      let errorMessage;
      if (currentResult.error) {
        errorMessage = currentResult.error;
        if (currentResult.value && currentResult.value.message) {
          errorMessage = currentResult.value.message;
        }
      }

      throw new TimeoutError({
        message: errorMessage || 'timeout error',
        now: new Date().getTime(),
        startTime: this.startTime,
        response: currentResult
      });
    }

    return deferred.promise;
  }

  run() {
    this.startTime = new Date().getTime();

    return this.runAction({});
  }

  reschedule(promise, opts, deferred) {
    setTimeout(() => {
      this.retries++;
      this.perform(promise, opts, deferred).catch(err => {
        deferred.reject(err);
      });
    }, this.rescheduleInterval);
  }

  shouldRetry() {
    const now = new Date().getTime();

    return now - this.startTime < this.ms;
  }
}

class TimeoutError extends Error {
  constructor({message, now, response, startTime}) {
    super(message);

    this.name = 'TimeoutError';
    this.now = now;
    this.response = response;
    this.startTime = startTime;
  }
}

module.exports = PeriodicPromise;
