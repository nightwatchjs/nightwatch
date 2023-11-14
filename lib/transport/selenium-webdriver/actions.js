const {error} = require('selenium-webdriver');

const {Logger, isObject, isFunction, isString} = require('../../utils');
const MethodMappings = require('./method-mappings.js');

class TransportActions {
  get transport() {
    return this.__transport;
  }

  get actions() {
    return this.__actions;
  }

  get compatMode() {
    return this.transport.settings.backwards_compatibility_mode;
  }

  constructor(transport) {
    this.__transport = transport;
    this.__actions = {};
    this.lastError = null;
    this.retriesCount = 0;
    this.MethodMappings = new MethodMappings(transport);
  }

  loadActions(methodMappings = this.MethodMappings.methods, target = this.__actions) {
    Object.keys(methodMappings).forEach(name => {
      if (!methodMappings[name]) {
        return;
      }

      if (isObject(methodMappings[name])) {
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
        if (isFunction(mapping)) {
          promise = Array.isArray(args) ? mapping.apply(this.MethodMappings, args) : mapping.call(this.MethodMappings, args);
        }

        if (!(promise instanceof Promise)) {
          const opts = {};

          if (isString(promise)) {
            opts.path = `/session/${definition.sessionId}${promise}`;
          } else if (isObject(promise)) {
            Object.assign(opts, promise);
            if (isFunction(opts.path)) {
              opts.path = await opts.path();
            }
            opts.path = `/session/${definition.sessionId}${opts.path}`;
          }

          promise = this.transport.runProtocolAction(opts);
        }

        result = await promise;

        return this.makeResult(result);
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

  makeResult(result) {
    this.transport.handleErrorResponse(result);

    if (Array.isArray(result) || !isObject(result)) {
      return {
        value: result,
        status: 0
      };
    }

    result.status = result.status || 0;

    return result;
  }

  handleError(err, commandName) {
    let errorMsg = 'Unknown error';
    try {
      this.transport.handleErrorResponse(err);
    } catch (error) {
      if (!error.message) {
        if (isString(err.value)) {
          error.message = err.value;
        } else if (isString(err.error)) {
          error.message = err.error;
        } else {
          error.message = 'Unknown error';
        }
      }

      err = error;
    }

    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (err && err.error) {
      errorMsg = err.error;
    }

    const {shouldRegisterError} = this.transport;
    const {lastError, retriesCount} = this;
    if (shouldRegisterError(err) && (retriesCount < 1 || lastError && err.name !== lastError.name)) {
      Logger.error(`Error while running .${commandName}() protocol action: ${errorMsg}\n`);
      this.lastError = err;
    }
    if (this.lastError && err.name === this.lastError.name) {
      this.retriesCount += 1;
    }

    if (err instanceof Error) {
      err.message = errorMsg;

      return err;
    }

    return new error.WebDriverError(errorMsg);
  }
}

module.exports = TransportActions;
