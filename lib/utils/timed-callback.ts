class TimeoutError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'TimeoutError';
  }
}

type OnTimeoutExpired = (err: Error, name: string, timeoutMs: number) => void;
type OnTimerStarted = (timeoutId: NodeJS.Timeout) => void;

class TimedCallback {
  private callbackFn: (err: unknown) => void;
  private name: string;
  private timeoutMs: number;

  private __timeoutId?: NodeJS.Timeout;
  private __onTimeoutExpired: OnTimeoutExpired | null;
  private __onTimerStarted: OnTimerStarted | null;

  constructor(callbackFn: (err: unknown) => void, name: string, timeoutMs: number) {
    this.callbackFn = callbackFn;
    this.name = name;
    this.timeoutMs = timeoutMs;
    this.__onTimeoutExpired = null;
    this.__onTimerStarted = null;
  }

  get onTimeoutExpired(): OnTimeoutExpired {
    return this.__onTimeoutExpired || function() {};
  }

  get onTimerStarted(): OnTimerStarted {
    return this.__onTimerStarted || function() {};
  }

  set onTimeoutExpired(val: OnTimeoutExpired) {
    this.__onTimeoutExpired = val;
  }

  set onTimerStarted(val: OnTimerStarted) {
    this.__onTimerStarted = val;
  }

  getWrapper() {
    this.createTimeout();

    return (err: unknown) => {
      clearTimeout(this.__timeoutId);
      this.callbackFn(err);
    };
  }

  createTimeout() {
    this.__timeoutId = setTimeout(() => {
      let err = new TimeoutError(`done() callback timeout of ${this.timeoutMs}ms was reached while executing "${this.name}".` +
        ' Make sure to call the done() callback when the operation finishes.');
      this.onTimeoutExpired(err, this.name, this.timeoutMs);
    }, this.timeoutMs);

    this.onTimerStarted(this.__timeoutId);
  }
}

export = TimedCallback;
