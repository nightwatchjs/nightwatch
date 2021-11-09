const EventEmitter = require('events');
const createPromise = require('./createPromise.js');

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
    timeout
  }) {
    super();

    this.__queue = [];
    this.__rescheduleIntervalMs = rescheduleInterval;
    this.__timeoutMs = timeout;
    this.retries = 0;
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
    const deferred = createPromise();

    try {
      const result = await this.perform(queuePromise, {prevResult, prevQueuePromise}, deferred);

      if (this.queue.length) {
        return await this.runAction({
          prevResult: result,
          prevQueuePromise: queuePromise
        });
      }

      return result;
    } catch (err) {
      if (err.name === 'TypeError' || err.name === 'ReferenceError' || !queuePromise.errorHandler) {
        throw err;
      }

      if (queuePromise.errorHandler) {
        return queuePromise.errorHandler(err);
      }
    }
  }

  async perform({
    action,
    validate,
    isResultStale,
    successHandler = (r) => Promise.resolve(r),
    shouldRetryOnError = () => true,
    retryOnSuccess = false,
    retryOnFailure = true
  }, {prevResult, prevQueuePromise}, deferred) {
    let currentResult;
    try {
      // running the current action using the result from the previous action
      currentResult = await action(prevResult);

      // if the current action returns a stale reference to the previous result, re-run the previous action
      if (isResultStale && isResultStale(currentResult)) {
        const freshResult = await prevQueuePromise.action({cacheElementId: false});
        if (freshResult.error instanceof Error) {
          throw freshResult.error;
        }
        currentResult = await action(freshResult);
      }
    } catch (err) {
      currentResult = {
        status: -1,
        message: err.message,
        stack: err.stack
      };
    }

    const isValidResult = validate(currentResult);

    if (this.shouldRetry({retryOnSuccess, isValidResult, currentResult, shouldRetryOnError, retryOnFailure})) {
      this.reschedule(arguments[0], arguments[1], deferred);

      return deferred.promise;
    }

    if (isValidResult) {
      currentResult = await successHandler(currentResult);
      deferred.resolve(currentResult);

      return deferred.promise;
    }

    throw this.getError(currentResult);
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

  shouldRetry({retryOnFailure, retryOnSuccess, shouldRetryOnError, isValidResult, currentResult}) {
    const now = new Date().getTime();
    const timePassed = (now - this.startTime) >= this.ms;
    const retryOnFailureResult = typeof retryOnFailure == 'function' ? retryOnFailure() : retryOnFailure;

    if (timePassed) {
      return false;
    }

    if (retryOnFailureResult && !isValidResult) {
      return shouldRetryOnError(currentResult);
    }

    const needsRetryOnSuccess = typeof retryOnSuccess == 'function' ? retryOnSuccess(currentResult) : retryOnSuccess;

    return (needsRetryOnSuccess && isValidResult);
  }

  getError(response) {
    if (response instanceof Error) {
      return response;
    }

    const {startTime, retries} = this;

    let {message = 'timeout error'} = response;
    if (response.error) {
      message = response.error;
      if (response.value && response.value.message) {
        message = response.value.message;
      } else if (message.message) {
        message = message.message;
      }
    }

    return new TimeoutError({
      message,
      now: Date.now(),
      startTime,
      response,
      retries
    });
  }
}

class TimeoutError extends Error {
  constructor({message, now, response, startTime, retries}) {
    super(message);

    this.name = 'TimeoutError';
    this.now = now;
    this.response = response;
    this.startTime = startTime;
    this.retries = retries;
  }
}

module.exports = PeriodicPromise;
