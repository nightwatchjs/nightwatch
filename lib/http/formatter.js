const {Logger} = require('../utils');
const jsonRegex = new RegExp('[\\u007f-\\uffff]', 'g');

class ResponseFormatter {
  /**
   * Built in JSON.stringify() will return unicode characters that require UTF-8 encoding on the wire.
   * This function will replace unicode characters with their escaped (ASCII-safe) equivalents to support
   * the keys sending command.
   *
   * @param {object} s
   * @returns {string}
   */
  static jsonStringify(s) {
    try {
      let json = JSON.stringify(s);
      if (json) {
        return json.replace(jsonRegex, function jsonRegexReplace(c) {
          return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
        });
      }

      return json;
    } catch (err) {

      Logger.error(err);

      return '';
    }
  }

  static stripUnknownChars(str) {
    let x = [];
    let i = 0;
    let length = str.length;

    for (i; i < length; i++) {
      if (str.charCodeAt(i)) {
        x.push(str.charAt(i));
      }
    }

    return x.join('');
  }

  static formatHostname(hostname, port, useSSL) {
    let isLocalHost = ['127.0.0.1', 'localhost'].indexOf(hostname) > -1;
    let protocol = useSSL ? 'https://' : 'http://';
    let isPortDefault = [80, 443].indexOf(port) > -1;

    if (isLocalHost) {
      return '';
    }

    return protocol + hostname + (!isPortDefault && (':' + port) || '');
  }
}

module.exports = ResponseFormatter;
