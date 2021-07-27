const Utils = require('../../utils');
const {Logger} = Utils;
const BaseActions = require('../actions.js');
const MethodMappings = require('./method-mappings.js');

class TransportActions extends BaseActions {
  get transport() {
    return this.__transport;
  }

  get actions() {
    return this.__actions;
  }

  constructor(transport) {
    super(transport);

    this.MethodMappings = new MethodMappings(transport);
    this.__actions = {};
  }

  loadActions(methodMappings = this.MethodMappings.methods, target = this.__actions) {

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
    return async (definition) => {
      const args = definition.args;
      let result;
      let promise;

      try {
        if (Utils.isFunction(mapping)) {
          promise = Array.isArray(args) ? mapping.apply(this.MethodMappings, args) : mapping.call(this.MethodMappings, args);
        }

        if (!(promise instanceof Promise)) {
          const opts = {};

          if (Utils.isString(promise)) {
            opts.path = `/session/${definition.sessionId}${promise}`;
          } else if (Utils.isObject(promise)) {
            Object.assign(opts, promise);
            opts.path = `/session/${definition.sessionId}${opts.path}`;
          }

          promise = this.transport.runProtocolAction(opts);
        }
        
        result = await promise;

        if (Array.isArray(result) || !Utils.isObject(result)) {
          return {
            value: result,
            status: 0
          };
        }

        result.status = result.status || 0;

        return result;
      } catch (err) {
        const error = this.handleError(err, name);

        return {
          error,
          status: -1,
          value: null
        };
      }
    };

  }

  handleError(err, commandName) {
    let errorMsg = 'Unknown error';
    if (err instanceof Error) {
      errorMsg = err.stack;
    } else if (err && err.error) {
      errorMsg = err.error;
    }

    if (this.transport.shouldRegisterError(err)) {
      Logger.error(`Error while running .${commandName}() protocol action: ${errorMsg}\n`);
    }

    return err;
  }
}

module.exports = TransportActions;
