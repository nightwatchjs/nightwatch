const Http = require('../http/http.js');
const Utils = require('../util/utils.js');
const Logger = require('../util/logger.js');

let __transport__ = null;

class ProtocolActions {
  static get Transport() {
    if (!__transport__) {
      throw new Error('Transport has not been initialized.');
    }

    return __transport__;
  }

  static post(opts) {
    if (typeof opts == 'string') {
      opts = ProtocolActions.createOptions(opts);
    }

    opts.data = opts.data || '';
    opts.method = Http.Method.POST;

    return opts;
  }

  static delete(opts) {
    if (typeof opts == 'string') {
      opts = ProtocolActions.createOptions(opts);
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

module.exports = {
  ProtocolActions: ProtocolActions,
  methodMappings: ProtocolActions.methodMappings
};

module.exports.addProtocolActions = function addProtocolActions(methodMappings, target = module.exports) {
  Object.keys(methodMappings).forEach(function(name) {
    if (!methodMappings[name]) {
      return;
    }

    if (!Utils.isObject(methodMappings[name])) {
      target[name] = function(definition) {
        let args = definition.args;
        let mapping = methodMappings[name];
        let requestOptions = mapping;

        if (Utils.isFunction(mapping)) {
          requestOptions = mapping(...args);
        }

        if (Utils.isString(requestOptions)) {
          requestOptions = ProtocolActions.createOptions(requestOptions);
        }

        if (definition.sessionId) {
          requestOptions.path = `/session/${definition.sessionId}${requestOptions.path}`;
        } else if (definition.sessionRequired) {
          throw new Error(`A session is required to run this command (${name}).`);
        }

        return ProtocolActions.Transport.runProtocolAction(requestOptions)
          .catch(result => {
            Logger.error(`Error while running .${name}() protocol action: ${result && result.error}\n`);

            return result;
          });
      };
    } else {
      module.exports[name] = module.exports[name] || {};
      addProtocolActions(methodMappings[name], module.exports[name]);
    }
  });
};

module.exports.setTransport = function(instance) {
  __transport__ = instance;
};

