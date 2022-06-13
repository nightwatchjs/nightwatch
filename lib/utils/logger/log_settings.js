const lodashClone = require('lodash.clone');

const Settings = {
  outputEnabled: true,
  showResponseHeaders: false,
  showRequestData: {
    enabled: true,
    trimLongScripts: true
  },
  detailedOutput: true,
  disableErrorLog: false,
  log_timestamp: false,
  timestamp_format: null,
  enabled: true
};

module.exports = new (function() {
  const logSettings = lodashClone(Settings, true);

  class LogSettings {
    get outputEnabled() {
      return logSettings.outputEnabled;
    }

    get detailedOutput() {
      return logSettings.detailedOutput;
    }

    get showRequestData() {
      return logSettings.showRequestData;
    }

    get enabled() {
      return logSettings.enabled;
    }

    get showResponseHeaders() {
      return logSettings.showResponseHeaders;
    }

    get timestampFormat() {
      return logSettings.timestamp_format;
    }

    set outputEnabled(value) {
      if (typeof value == 'undefined') {
        value = true;
      }

      logSettings.outputEnabled = value;
    }

    set detailedOutput(value) {
      logSettings.detailedOutput = value;
    }

    set disableErrorLog(value) {
      if (typeof value == 'undefined') {
        value = true;
      }

      logSettings.disableErrorLog = value;
    }

    set htmlReporterEnabled(value) {
      logSettings.htmlReporterEnabled = value;
    }

    get htmlReporterEnabled() {
      return logSettings.htmlReporterEnabled;
    }

    isLogTimestamp() {
      return logSettings.log_timestamp;
    }

    isErrorLogEnabled() {
      return !logSettings.disableErrorLog;
    }

    disable() {
      logSettings.enabled = false;
    }

    enable() {
      logSettings.enabled = true;
    }

    setLogTimestamp(val, format) {
      logSettings.log_timestamp = val;
      logSettings.timestamp_format = format;
    }

    setHttpLogOptions({showRequestData, showResponseHeaders}) {
      logSettings.showRequestData = showRequestData;
      logSettings.showResponseHeaders = showResponseHeaders;
    }


  }

  return new LogSettings();
})();