class LogSettings {
  constructor() {
    this.__outputEnabled = true;
    this.__showResponseHeaders = false;
    this.__showRequestData = {
      enabled: true,
      trimLongScripts: true
    },
    this.__detailedOutput = true;
    this.__disableErrorLog = false;
    this.__log_timestamp = false;
    this.__timestamp_format = null;
    this.__enabled = true;
    this.__htmlReporterEnabled = false;
  }

  get outputEnabled() {
    return this.__outputEnabled;
  }

  get detailedOutput() {
    return this.__detailedOutput;
  }

  get showRequestData() {
    return this.__showRequestData;
  }

  get enabled() {
    return this.__enabled;
  }

  get showResponseHeaders() {
    return this.__showResponseHeaders;
  }

  get timestampFormat() {
    return this.__timestamp_format;
  }

  set outputEnabled(value) {
    if (typeof value === 'undefined') {
      value = true;
    }

    this.__outputEnabled = value;
  }

  set detailedOutput(value) {
    this.__detailedOutput = value;
  }

  set disableErrorLog(value) {
    if (typeof value == 'undefined') {
      value = true;
    }

    this.__disableErrorLog = value;
  }

  set htmlReporterEnabled(value) {
    this.__htmlReporterEnabled = value;
  }

  get htmlReporterEnabled() {
    return this.__htmlReporterEnabled;
  }

  isLogTimestamp() {
    return this.__log_timestamp;
  }

  isErrorLogEnabled() {
    return !this.__disableErrorLog;
  }

  disable() {
    this.__enabled = false;
  }

  enable() {
    this.__enabled = true;
  }

  setLogTimestamp(val, format) {
    this.__log_timestamp = val;
    this.__timestamp_format = format;
  }

  setHttpLogOptions({showRequestData, showResponseHeaders}) {
    this.__showRequestData = showRequestData;
    this.__showResponseHeaders = showResponseHeaders;
  }
}

module.exports = new LogSettings();
