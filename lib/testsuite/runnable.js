class Runnable {
  constructor(name, runFn, opts = {}) {
    this.name = name;
    this.resolved = false;
    this.deffered = {
      settled: false,

      /**
       * @type {Promise}
       */
      promise: null,

      /**
       * @type {Function}
       */
      rejectFn: null,

      /**
       * @type {Function}
       */
      resolveFn: null,

      name
    };

    this.isES6Async = opts.isES6Async;
    this.createPromise();
    this.setRunFn(runFn);
  }

  get runFn() {
    return this.__runFn;
  }

  get currentPromise() {
    if (!this.deffered.promise) {
      return null;
    }

    return {
      runnable: this.name,
      resolve: this.deffered.resolveFn,
      reject: this.deffered.rejectFn,
      command: this.queue && this.queue.currentNode.name
    };
  }

  setQueue(queue) {
    this.queue = queue;
    this.queue.reset();

    return this;
  }

  /**
   *
   * @param {function} runFn
   */
  setRunFn(runFn) {
    if (typeof runFn != 'function') {
      throw new Error(`Runnable must be a function. "${typeof runFn}" given.`);
    }

    this.__runFn = runFn;

    return this;
  }

  createPromise() {
    this.deffered.promise = new Promise((resolve, reject) => {
      this.deffered.resolveFn = (result) => {
        if (!this.deffered.settled) {
          resolve(result);
        }

        this.deffered.settled = true;
      };

      this.deffered.rejectFn = (err, force = false) => {
        if (!this.deffered.settled || force) {
          reject(err);
        }

        this.deffered.settled = true;
      };
    });

    return this;
  }

  abort(err) {
    return new Promise((resolve) => {
      if (this.currentPromise && this.queueInProgress()) {
        return this.deffered.promise.then(_ => resolve()).catch(_ => resolve());
      }

      resolve();
    }).then(_ => {
      this.currentPromise.reject(err, true);

      return err;
    });
  }

  setDoneCallback(cb) {
    const originalResolve = this.deffered.resolveFn;
    const originalReject = this.deffered.rejectFn;
    this.deffered.resolveFn = function() {};
    this.deffered.rejectFn = function() {};

    return (result) => {
      if (result instanceof Error) {
        originalReject(result);
      } else {
        originalResolve(result);
      }
    };
  }

  run(queue = null) {
    this.setQueue(queue);

    let result;

    try {
      result = this.runFn();
    } catch (err) {
      this.deffered.rejectFn(err);

      return this.deffered.promise;
    }

    if (result instanceof Promise) {
      const deferredFn = () => {
        result
          .then(res_ => {
            if (this.queueInProgress()) {
              return;
            }

            this.deffered.resolveFn(res_);
          })
          .catch(err => {
            this.deffered.rejectFn(err);
          });
      };

      if (this.isES6Async) {
        // the timeout is needed for situations where there is an async function without any await commands
        setTimeout(() => deferredFn(), 20);

        // without .catch() here, we can get an unhandledRejection
        result
          .catch(err => {
            this.deffered.rejectFn(err);
          });
      } else {
        deferredFn();
      }
    }

    // `this.currentTestCaseResult` represents the return value of the currently
    // running test case or hook.
    // in case the runnable is executing something other than a test case/hook,
    // `this.currentTestCaseResult` will be `undefined`.
    if (this.currentTestCaseResult instanceof Promise) {
      this.currentTestCaseResult
        .catch(() => {
          // to avoid unhandledRejections
          // although the test case promises are already handled for rejections
          // above (`result.catch()`), if we don't use `.catch()` here again,
          // `.finally` will return a new promise that will be rejected without
          // any error handling.
        })
        .finally(() => {
          // mark the promise as settled as a cue to the asynctree so that it
          // can get cleared out and subsequently call the queue `done` method.
          this.currentTestCaseResult.settled = true;

          // sometimes this promise is settled after the last call of
          // asynctree `done` method, so we need schedule a tree traversal
          // again to clear out the tree and call the queue `done` method.
          this.queue.scheduleTraverse();
        });
    }

    this.queue.run(this.currentTestCaseResult).then(err => {
      if (err) {
        return this.deffered.rejectFn(err);
      }

      this.deffered.resolveFn(result);
    });

    return this.deffered.promise;
  }

  queueInProgress() {
    return this.queue.tree.inProgress;
  }
}

module.exports = Runnable;
