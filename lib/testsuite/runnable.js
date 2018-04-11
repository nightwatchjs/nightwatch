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

  run(queue) {
    this.setQueue(queue);

    this.deffered.promise = new Promise((resolve, reject) => {
      let result;

      this.deffered.resolveFn = (...args) => {
        if (!this.deffered.settled) {
          resolve(...args);
        }

        this.deffered.settled = true;
      };

      this.deffered.rejectFn = (...args) => {
        if (!this.deffered.settled) {
          reject(...args);
        }

        this.deffered.settled = true;
      };

      try {
        result = this.runFn();
      } catch (err) {
        return reject(err);
      }

      if (result instanceof Promise) {
        result
          .then(result => {
            if (this.queueInProgress()) {
              return;
            }

            this.deffered.resolveFn(result);
          })
          .catch(err => {
            this.deffered.rejectFn(err);
          });
      }

      this.queue.run(err => {
        if (err) {
          return this.deffered.rejectFn(err);
        }

        this.deffered.resolveFn(result);
      });
    });

    return this.deffered.promise;
  }

  queueInProgress() {
    return this.queue.currentNode.started && !this.queue.currentNode.done;
  }
}

module.exports = Runnable;