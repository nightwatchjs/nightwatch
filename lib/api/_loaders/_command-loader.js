const path = require('path');
const fs = require('fs');
const Element = require('../../element');
const Utils = require('../../utils');
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

  get module() {
    return this.__module;
  }

  set module(val) {
    this.__module = val;
  }

  get commandName() {
    return this.__commandName;
  }

  get commandFn() {
    return this.__commandFn;
  }

  set commandFn(val) {
    this.__commandFn = val;
  }

  set commandName(val) {
    this.__commandName = val;
  }

  set stackTrace(val) {
    this.__stackTrace = val;
  }

  get stackTrace() {
    return this.__stackTrace;
  }

  get instance() {
    return this.__instance;
  }

  get isUserDefined() {
    return this.__isUserDefined;
  }

  set isUserDefined(val) {
    this.__isUserDefined = val;
  }

  set ignoreUnderscoreLeadingNames(val) {
    this.__ignoreUnderscoreNames = val;
  }

  get ignoreUnderscoreLeadingNames() {
    return this.__ignoreUnderscoreNames && !this.isUserDefined;
  }

  loadModule(dirPath, fileName) {
    const fullPath = path.join(dirPath, fileName);
    if (!this.loadSubDirectories && fs.lstatSync(fullPath).isDirectory()) {
      return this;
    }

    this.requireModule(fullPath, fileName);

    return this;
  }

  requireModule(fullPath, fileName) {
    if (!this.isFileNameValid(fileName)) {
      return this;
    }

    if (this.isTypescriptDisabled() && Utils.isTsFile(fileName)) {
      return this;
    }

    this.commandName = path.parse(fullPath).name;
    this.fileName = fullPath;

    try {
      this.module = Utils.requireModule(fullPath);
    } catch (err) {
      throw new Error(`There was an error while trying to load the file ${fileName}: ${err.message}`);
    }
  }

  validateMethod(parent) {
    let namespace = this.getTargetNamespace(parent);
    if (Array.isArray(namespace) && namespace.length > 0) {
      namespace = BaseLoader.unflattenNamespace(this.api, namespace.slice());
    }

    if (this.nightwatchInstance.isApiMethodDefined(this.commandName, namespace)) {
      throw new Error(`The ${this.type} ${this.namespace || ''}.${this.commandName}() is already defined.`);
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

    if (!namespace) {
      return parent;
    }

    parent[namespace] = parent[namespace] || {};

    return parent[namespace];
  }

}

module.exports = BaseCommandLoader;
