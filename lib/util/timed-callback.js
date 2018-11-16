class TimeoutError extends Error {
  constructor(message) {
    super(message);

    this.name = 'TimeoutError';
  }
}

class TimedCallback {

  constructor(callbackFn, name, timeoutMs) {
    this.callbackFn = callbackFn;
    this.name = name;
    this.timeoutMs = timeoutMs;
    this.__onTimeoutExpired = null;
    this.__onTimerStarted = null;
  }

  get onTimeoutExpired() {
    return this.__onTimeoutExpired || function() {};
  }

  get onTimerStarted() {
    return this.__onTimerStarted || function() {};
  }

  /**
   * @param {function} val
   */
  set onTimeoutExpired(val) {
    this.__onTimeoutExpired = val;
  }

  /**
   * @param {function} val
   */
  set onTimerStarted(val) {
    this.__onTimerStarted = val;
  }

  getWrapper() {
    this.createTimeout();

    return (err) => {
      clearTimeout(this.timeoutId);
      this.callbackFn(err);
    };
  }

  createTimeout() {
    this.timeoutId = setTimeout(() => {
      let err = new TimeoutError(`done() callback timeout of ${this.timeoutMs}ms was reached while executing "${this.name}".` +
        ' Make sure to call the done() callback when the operation finishes.');
      this.onTimeoutExpired(err, this.name, this.timeoutMs);
    }, this.timeoutMs);

    this.onTimerStarted(this.timeoutId);
  }
}

module.exports = TimedCallback;