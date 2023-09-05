class LogSettings {
  #outputEnabled;
  #showResponseHeaders;
  #showRequestData;
  #detailedOutput;
  #disableErrorLog;
  #log_timestamp;
  #timestamp_format;
  #enabled;
  #htmlReporterEnabled;

  constructor() {
    this.#outputEnabled = true;
    this.#showResponseHeaders = false;
    this.#showRequestData = {
      enabled: true,
      trimLongScripts: true
    },
    this.#detailedOutput = true;
    this.#disableErrorLog = false;
    this.#log_timestamp = false;
    this.#timestamp_format = null;
    this.#enabled = true;
    this.#htmlReporterEnabled = false;
  }

  get outputEnabled() {
    return this.#outputEnabled;
  }

  get detailedOutput() {
    return this.#detailedOutput;
  }

  get showRequestData() {
    return this.#showRequestData;
  }

  get enabled() {
    return this.#enabled;
  }

  get showResponseHeaders() {
    return this.#showResponseHeaders;
  }

  get timestampFormat() {
    return this.#timestamp_format;
  }

  set outputEnabled(value) {
    if (typeof value === 'undefined') {
      value = true;
    }

    this.#outputEnabled = value;
  }

  set detailedOutput(value) {
    this.#detailedOutput = value;
  }

  set disableErrorLog(value) {
    if (typeof value === 'undefined') {
      value = true;
    }

    this.#disableErrorLog = value;
  }

  set htmlReporterEnabled(value) {
    this.#htmlReporterEnabled = value;
  }

  get htmlReporterEnabled() {
    return this.#htmlReporterEnabled;
  }

  isLogTimestamp() {
    return this.#log_timestamp;
  }

  isErrorLogEnabled() {
    return !this.#disableErrorLog;
  }

  disable() {
    this.#enabled = false;
  }

  enable() {
    this.#enabled = true;
  }

  setLogTimestamp(val, format) {
    this.#log_timestamp = val;
    this.#timestamp_format = format;
  }

  setHttpLogOptions({showRequestData, showResponseHeaders}) {
    this.#showRequestData = showRequestData;
    this.#showResponseHeaders = showResponseHeaders;
  }
}

module.exports = new LogSettings();
