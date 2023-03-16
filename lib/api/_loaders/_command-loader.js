const Element = require('../../element');
const BaseLoader = require('./_base-loader.js');

class BaseCommandLoader extends BaseLoader {
  constructor(nightwatchInstance) {
    super(nightwatchInstance);

    this.type = 'command';
    this.__namespace = null;
    this.__module = null;
    this.__commandName = null;
    this.__commandFn = null;
    this.__instance = null;
    this.__isUserDefined = false;

    this.ignoreUnderscoreLeadingNames = true;
  }

  static isTypeImplemented(instance, method, type) {
    const methodTypes = method.split('|');

    if (type === '*') {
      return instance[method] !== undefined;
    }

    return methodTypes.some(method => (typeof instance[method] == type));
  }

  get sessionId() {
    return this.nightwatchInstance.session.sessionId;
  }

  getCommandOptions() {
    const redact = this.module.RedactParams || false;
    const alwaysAsync = this.module.alwaysAsync || false;
    const isTraceable = this.module.isTraceable;

    return {redact, alwaysAsync, isTraceable};
  }

  validateMethod(parent) {
    let namespace = this.getTargetNamespace(parent);
    if (Array.isArray(namespace) && namespace.length > 0) {
      namespace = BaseLoader.unflattenNamespace(this.api, namespace.slice());
    }

    if (this.module.allowOverride) {
      this.nightwatchInstance.overridableCommands.add(this.commandName);
    }

    if (this.nightwatchInstance.isApiMethodDefined(this.commandName, namespace) && !this.nightwatchInstance.overridableCommands.has(this.commandName)) {
      const err = new TypeError(`Error while loading the API commands: the ${this.type} ${this.namespace || ''}.${this.commandName}() is already defined.`);
      err.displayed = false;
      err.detailedErr = `Source: ${this.fileName}`;
      err.showTrace = false;

      throw err;
    }

    return this;
  }

  resolveElementSelector(args) {
    if ((args[0] instanceof Element) && this.isUserDefined) {
      const element = args[0];

      if (element.usingRecursion) {
        return this.elementLocator.resolveElementRecursively({element});
      }

      return Promise.resolve(element);
    }

    return Promise.resolve();
  }

  getTargetNamespace(parent) {
    let namespace = this.namespace;

    if (!parent) {
      return namespace;
    }

    if (!namespace || namespace.length === 0) {
      return parent;
    }

    // would give unexpected results if command with nested namespaces
    // is loaded onto say page-object (but wouldn't throw an error)
    parent[namespace] = parent[namespace] || {};

    return parent[namespace];
  }
}

module.exports = BaseCommandLoader;
