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
    return (definition) => {
      const args = definition.args;
      let promise;

      if (Utils.isFunction(mapping)) {
        promise = Array.isArray(args) ? mapping.apply(this.MethodMappings, args) : mapping.call(this.MethodMappings, args);
      }

      /*
      if (Utils.isString(mapping)) {
        promise = this.runAction(TransportActions.createOptions(requestOptions));
      }

      if (definition.sessionId) {
        requestOptions.path = `/session/${definition.sessionId}${requestOptions.path}`;
      } else if (definition.sessionRequired) {
        throw new Error(`A session is required to run this command (${name}).`);
      }
      */

      return promise.catch(result => this.handleError(result, name));
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

  runAction(requestOptions) {
    console.log('RUN ACTION', requestOptions);

    return Promise.resolve({});
  }

  static createOptions(uri) {
    return {
      path: uri
    };
  }
}

module.exports = TransportActions;
