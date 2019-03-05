const EventEmitter = require('events');
const Utils = require('./utils.js');

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
    errorHandler,
    timeout,
  }) {
    super();

    this.__queue = [];
    this.errorHandler = errorHandler;
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
    const result = await this.perform(queuePromise, {prevResult, prevQueuePromise}, deferred);

    if (this.queue.length) {
      return await this.runAction({
        prevResult: result,
        prevQueuePromise: queuePromise
      });
    }

    return result;
  }

  async perform({action, retry, validate, isResultStale}, {prevResult, prevQueuePromise}, deferred) {
    let currentResult;
    try {
      // running the current action using the result from the previous action
      currentResult = await action(prevResult);

      // if the current action returns a stale reference to the previous result, re-run the previous action
      if (isResultStale && isResultStale(currentResult)) {
        const freshResult = await this.perform(prevQueuePromise, {});
        currentResult = await action(freshResult);
      }
    } catch (err) {
      //console.log('ERROR', err)
      currentResult = {status: -1};
    }

    // validate the result and handle
    if (validate(currentResult)) {
      this.handleSuccessResult(arguments[0], arguments[1], currentResult, deferred);
    } else if (this.shouldRetry()) {
      this.reschedule(arguments[0], deferred);
    } else {
      deferred.reject(new TimeoutError({
        message: 'timeout error',
        now: new Date().getTime(),
        startTime: this.startTime,
        action: 'perform'
      }));
    }

    return deferred.promise;
  }

  handleSuccessResult(promise, opts, result, deferred) {
    if (promise.retryOnSuccess && this.shouldRetry()) {
      this.reschedule(promise, opts, deferred);
    } else {
      deferred.resolve(result);
    }
  }

  run() {
    this.startTime = new Date().getTime();

    return this.runAction().catch(err => this.errorHandler(err));
  }

  reschedule(...args) {
    setTimeout(() => {
      this.retries++;
      this.promise(...args);
    }, this.rescheduleInterval);
  }

  shouldRetry() {
    const now = new Date().getTime();

    return now - this.startTime < this.ms;
  }

  // async performWithResult(prevResult, deferred = Utils.createPromise()) {
  //   try {
  //     let actionResult = await this.actionWithResult(prevResult);
  //     let freshResult;
  //     if (this.staleCondition(actionResult)) {
  //       freshResult = await this.perform();
  //       actionResult = await this.actionWithResult(freshResult);
  //     }
  //
  //     const newResult = freshResult || prevResult;
  //
  //     if (this.validCondition(actionResult)) {
  //       this.handle_valid_action_with_result(deferred, newResult, actionResult);
  //     } else if (this.shouldRetry()) {
  //       this.reschedule('performWithResult', [newResult, deferred]);
  //     } else {
  //       deferred.reject(new TimeoutError({
  //         message: 'timeout error',
  //         now: new Date().getTime(),
  //         startTime: this.startTime,
  //         action: 'performWithResult'
  //       }));
  //     }
  //   } catch (err) {
  //     deferred.reject(err);
  //   }
  //
  //   return deferred.promise;
  // }
}

class TimeoutError extends Error {
  constructor({message, now, action, startTime}) {
    super(message);

    this.name = 'TimeoutError';
    this.now = now;
    this.action = action;
    this.startTime = startTime;
  }
}

module.exports = PeriodicPromise;
