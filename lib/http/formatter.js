const DO_NOT_LOG_ERRORS = [
  'Unable to locate element',
  '{"errorMessage":"Unable to find element',
  'no such element'
];
const jsonRegex = new RegExp('[\\u007f-\\uffff]', 'g');

function hasLocalizedMessage(result) {
  return !!result.localizedMessage;
}

function shouldLogErrorMessage(msg) {
  return !DO_NOT_LOG_ERRORS.some(function(item) {
    return msg.indexOf(item) === 0;
  });
}

function jsonRegexReplace(c) {
  return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
}

module.exports = {
  /**
   * Built in JSON.stringify() will return unicode characters that require UTF-8 encoding on the wire.
   * This function will replace unicode characters with their escaped (ASCII-safe) equivalents to support
   * the keys sending command.
   *
   * @param {object} s
   * @returns {string}
   */
  jsonStringify(s) {
    let json = JSON.stringify(s);
    if (json) {
      return json.replace(jsonRegex, jsonRegexReplace);
    }

    return json;
  },

  stripUnknownChars(str) {
    let x = [];
    let i = 0;
    let length = str.length;

    for (i; i < length; i++) {
      if (str.charCodeAt(i)) {
        x.push(str.charAt(i));
      }
    }

    return x.join('');
  },

  formatErrorMessage(info) {
    let msg = hasLocalizedMessage(info) ? info.localizedMessage : info.message;
    if (shouldLogErrorMessage(msg)) {
      msg = msg.replace(/\n/g, '\n\t');
    }
    return msg;
  },

  needsFormattedErrorMessage(result) {
    return !!(result.localizedMessage || result.message);
  },

  formatHostname(hostname, port, useSSL) {
    let isLocalHost = ['127.0.0.1', 'localhost'].indexOf(hostname) > -1;
    let protocol = useSSL ? 'https://' : 'http://';
    let isPortDefault = [80, 443].indexOf(port) > -1;

    if (isLocalHost) {
      return '';
    }

    return protocol + hostname + (!isPortDefault && (':' + port) || '');
  }
};