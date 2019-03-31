class Runnable {
  constructor(name, runFn) {
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
      resolveFn: null
    };

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
    let originalResolve = this.deffered.resolveFn;
    let originalReject = this.deffered.rejectFn;
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
      return this.deffered.rejectFn(err);
    }

    if (result instanceof Promise) {
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
    }

    this.queue.run().then(err => {
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
