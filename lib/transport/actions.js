const Http = require('../http/http.js');
const Utils = require('../util/utils.js');
const Logger = require('../util/logger.js');

class TransportActions {
  get transport() {
    return this.__transport;
  }

  get actions() {
    return this.__actions;
  }

  constructor(transport) {
    this.__transport = transport;
    this.__actions = {};
  }

  loadActions(methodMappings, target = this.__actions) {
    Object.keys(methodMappings).forEach(name => {
      if (!methodMappings[name]) {
        return;
      }

      if (!Utils.isObject(methodMappings[name])) {
        target[name] = definition => {
          const args = definition.args;
          const mapping = methodMappings[name];

          let requestOptions = mapping;

          if (Utils.isFunction(mapping)) {
            requestOptions = mapping(...args);
          }

          if (Utils.isString(requestOptions)) {
            requestOptions = TransportActions.createOptions(requestOptions);
          }

          if (definition.sessionId) {
            requestOptions.path = `/session/${definition.sessionId}${requestOptions.path}`;
          } else if (definition.sessionRequired) {
            throw new Error(`A session is required to run this command (${name}).`);
          }

          return this.transport.runProtocolAction(requestOptions)
            .catch(result => {
              Logger.error(`Error while running .${name}() protocol action: ${result && result.error}\n`);

              return result;
            });
        };
      } else {
        this.__actions[name] = this.__actions[name] || {};
        this.loadActions(methodMappings[name], this.__actions[name]);
      }
    });
  }

  static post(opts) {
    if (typeof opts == 'string') {
      opts = TransportActions.createOptions(opts);
    }

    opts.data = opts.data || '';
    opts.method = Http.Method.POST;

    return opts;
  }

  static delete(opts) {
    if (typeof opts == 'string') {
      opts = TransportActions.createOptions(opts);
    }

    opts.method = Http.Method.DELETE;

    return opts;
  }

  static createOptions(uri) {
    return {
      path: uri
    };
  }
}

module.exports = TransportActions;