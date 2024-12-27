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

  static commandRegistry = new Map();

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
    const avoidPrematureParentNodeResolution = !!this.module.avoidPrematureParentNodeResolution;
    const rejectNodeOnAbortFailure = !!this.module.rejectNodeOnAbortFailure;

    return {redact, alwaysAsync, isTraceable, avoidPrematureParentNodeResolution, rejectNodeOnAbortFailure};
  }

  validateMethod(parent) {
    let namespace = this.getTargetNamespace(parent);
    if (Array.isArray(namespace) && namespace.length > 0) {
      namespace = BaseLoader.unflattenNamespace(this.api, namespace.slice());
    }

    if (this.module.allowOverride) {
      this.nightwatchInstance.overridableCommands.add(this.commandName);
    }

    const commandKey = `${this.namespace || ''}.${this.commandName}`;
    const currentFile = this.fileName;

    if (BaseCommandLoader.commandRegistry.has(commandKey)) {
      const firstDefinedFile = BaseCommandLoader.commandRegistry.get(commandKey);

      const err = new TypeError(
        `Error while loading the API commands: the ${this.type} ${commandKey}() is already defined.\n` +
        `- First defined in: ${firstDefinedFile}\n` +
        `- Current file: ${currentFile}`
      );

      err.displayed = false;
      err.showTrace = false;

      throw err;
    }

    BaseCommandLoader.commandRegistry.set(commandKey, currentFile);

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
    const namespace = this.namespace;

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
