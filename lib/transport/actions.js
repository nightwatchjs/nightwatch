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

      if (Utils.isObject(methodMappings[name])) {
        this.__actions[name] = this.__actions[name] || {};
        this.loadActions(methodMappings[name], this.__actions[name]);
      } else {
        target[name] = this.createAction(name, methodMappings[name]);
      }
    });
  }

  createAction(name, mapping) {
    return (definition) => {
      const args = definition.args;
      let requestOptions = mapping;

      if (Utils.isFunction(mapping)) {
        requestOptions = Array.isArray(args) ? mapping(...args) : mapping(args);
      }

      if (Utils.isString(requestOptions)) {
        requestOptions = TransportActions.createOptions(requestOptions);
      }

      if (definition.sessionId) {
        requestOptions.path = `/session/${definition.sessionId}${requestOptions.path}`;
      } else if (definition.sessionRequired) {
        throw new Error(`A session is required to run this command (${name}).`);
      }

      return this.transport
        .runProtocolAction(requestOptions)
        .catch(result => this.handleError(result, name));
    };

  }

  handleError(result, commandName) {
    let errorMsg = 'Unknown error';
    if (result instanceof Error) {
      errorMsg = result.stack;
    } else if (result && result.error) {
      errorMsg = result.error;
    }

    // FIXME: report this error so it can be added to the error results?
    if (this.transport.shouldRegisterError(errorMsg)) {
      Logger.error(`Error while running .${commandName}() protocol action: ${errorMsg}\n`);
    }

    return result;
  }

  static post(opts) {
    if (typeof opts == 'string') {
      opts = TransportActions.createOptions(opts);
    }

    opts.data = opts.data || {};
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
