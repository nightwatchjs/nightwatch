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

  #timeoutId?: NodeJS.Timeout;
  #onTimeoutExpired: OnTimeoutExpired | null;
  #onTimerStarted: OnTimerStarted | null;

  constructor(callbackFn: (err: unknown) => void, name: string, timeoutMs: number) {
    this.callbackFn = callbackFn;
    this.name = name;
    this.timeoutMs = timeoutMs;
    this.#onTimeoutExpired = null;
    this.#onTimerStarted = null;
  }

  get onTimeoutExpired(): OnTimeoutExpired {
    return this.#onTimeoutExpired || function() {};
  }

  get onTimerStarted(): OnTimerStarted {
    return this.#onTimerStarted || function() {};
  }

  set onTimeoutExpired(val: OnTimeoutExpired) {
    this.#onTimeoutExpired = val;
  }

  set onTimerStarted(val: OnTimerStarted) {
    this.#onTimerStarted = val;
  }

  getWrapper() {
    this.createTimeout();

    return (err: unknown) => {
      clearTimeout(this.#timeoutId);
      this.callbackFn(err);
    };
  }

  private createTimeout() {
    this.#timeoutId = setTimeout(() => {
      let err = new TimeoutError(`done() callback timeout of ${this.timeoutMs}ms was reached while executing "${this.name}".` +
        ' Make sure to call the done() callback when the operation finishes.');
      this.onTimeoutExpired(err, this.name, this.timeoutMs);
    }, this.timeoutMs);

    this.onTimerStarted(this.#timeoutId);
  }
}

export = TimedCallback;
