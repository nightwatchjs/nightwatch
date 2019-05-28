const EventEmitter = require('events');
const Logger = require('../util/logger.js');
const TreeNode = require('./treenode.js');
const Utils = require('../util/utils.js');

class AsyncTree extends EventEmitter{
  get started() {
    return this.rootNode.started;
  }

  get rootNode() {
    return this.__rootNode__;
  }

  get inProgress() {
    return this.currentNode.started && !this.currentNode.done;
  }

  constructor() {
    super();
    this.createRootNode();
  }

  addNode(node) {
    this.currentNode.childNodes.push(node);
  }

  createRootNode() {
    this.__rootNode__ = new TreeNode({
      name: '__root__',
      parent: null
    });

    this.currentNode = this.rootNode;
  }

  traverse() {
    const childNode = AsyncTree.getNextChildNode(this.currentNode);

    if (childNode) {
      return this.runChildNode(childNode);
    }

    if (this.currentNode.childNodes.length > 0 && this.currentNode.needsPromise) {
      this.currentNode.deferred.resolve();
    } else if (this.currentNode.name === '__root__') {
      return this.done();
    }

    return this.walkUp();
  }

  walkUp() {
    if (this.currentNode.childNodes.length > 0 && !this.currentNode.done) {
      // if the current node has childNodes that have not finished yet
      return this.currentNode.result;
    }

    if (!this.currentNode.done) {
      // if the current node hasn't finished yet
      return this.currentNode.result;
    }

    this.currentNode = this.currentNode.parent;

    return this.traverse();
  }

  runChildNode(node) {
    this.currentNode = node;
    this.currentNode.started = true;
    Logger.log(`\n ${Logger.colors.green('→')} Running command: ${Logger.colors.light_green(node.fullName)} (${AsyncTree.printArguments(node)})`);

    return node.run()
      .then(result => {
        let abortOnFailure = false;

        if (result instanceof Error) {
          node.reject(result);
          abortOnFailure = result.abortOnFailure || Utils.isUndefined(result.abortOnFailure);
        } else {
          node.resolve(result);
        }

        Logger.log(`${Logger.colors.green('→')} Completed command ${Logger.colors.light_green(node.fullName)}` +
          ` (${AsyncTree.printArguments(node)}) (${node.elapsedTime}ms)`);

        if (abortOnFailure) {
          return this.done(result);
        }

        return this.traverse();
      });
  }

  empty() {
    this.rootNode.childNodes = [];

    return this;
  }

  reset() {
    this.rootNode.started = false;
    this.rootNode.done = false;
    this.currentNode = this.rootNode;

    return this;
  }

  done(err = null) {
    this.emit('asynctree:finished', this);
    this.empty();
    this.createRootNode();

    return Promise.resolve(err);
  }

  ///////////////////////////////////////////////////////////////////////////
  // STATIC
  ///////////////////////////////////////////////////////////////////////////
  static getNextChildNode(node) {
    let childNode;
    for (let i = 0; i < node.childNodes.length; i++) {
      if (!node.childNodes[i].started) {
        return node.childNodes[i];
      }

      if (node.childNodes[i].childNodes.length > 0) {
        childNode = node.childNodes[i];
      }
    }

    return false;
  }

  static get argFilters() {
    return {
      setValue(...args) {
        if (args.length === 4) {
          args[2] = '<redacted>';
        } else if (args.length === 3) {
          args[1] = '<redacted>';
        }

        return args;
      }
    };
  }

  static printArguments(node) {
    let args = node.args ? node.args.slice(0) : [];
    if (AsyncTree.argFilters[node.name]) {
      args = AsyncTree.argFilters[node.name](...args);
    }

    return args.map(function(arg) {
      if (arg === null || arg === undefined) {
        return arg;
      }

      switch (typeof arg) {
        case 'function':
          return '[Function]';
        case 'string':
          return `'${arg}'`;
        case 'object':
          return `{${Object.keys(arg).join(', ')}}`;
        default:
          return arg.toString();
      }
    }).join(', ');
  }
}

module.exports = AsyncTree;
