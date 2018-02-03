class Runnable {
  constructor(runFn) {
    this.resolved = false;
    this.setRunFn(runFn);
  }

  get runFn() {
    return this.__runFn;
  }

  setQueue(queue) {
    this.queue = queue;

    return this;
  }

  /**
   *
   * @param {function} runFn
   */
  setRunFn(runFn) {
    if (typeof runFn != 'function') {
      throw new Error(`Runnable must be a function. "${typeof runFn}" given.`)
    }

    this.__runFn = runFn;

    return this;
  }

  run(queue) {
    this.setQueue(queue);

    return new Promise((resolve, reject) => {
      let result;

      try {
        result = this.runFn();
      } catch (err) {
        return reject(err);
      }

      if (result instanceof Promise) {
        result
          .then(result => {
            if (!this.resolved) {
              resolve(result);
            }
            this.resolved = true;
          })
          .catch(err => {
            reject(err);
          });
      }

      this.queue.reset().run(err => {
        if (err) {
          return reject(err);
        }

        if (!this.resolved) {
          resolve();
        }

        this.resolved = true;
      });
    });
  }
}

module.exports = Runnable;