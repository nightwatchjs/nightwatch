const EventEmitter = require('events');
const Utils = require('../utils');
const TreeNode = require('./treenode.js');
const {Logger} = Utils;

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

  constructor({compatMode, foreignRunner, cucumberRunner, mochaRunner}) {
    super();
    this.compatMode = compatMode;
    this.foreignRunner = foreignRunner;
    this.cucumberRunner = cucumberRunner;
    this.mochaRunner = mochaRunner;
    this.createRootNode();
    this.returnError = null;
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

  async traverse(err) {
    this.rootNode.started = true;
    const childNode = AsyncTree.getNextChildNode(this.currentNode);

    if (childNode) {
      const result = await this.runChildNode(childNode);

      return result;
    }

    if (this.currentNode.childNodes.length > 0 && this.currentNode.needsPromise) {
      this.currentNode.deferred.resolve();
    } else if (this.currentNode.isRootNode) {
      const result = await this.done(err);

      return result;
    }

    return await this.walkUp(err);
  }

  async walkUp(err) {
    if (this.currentNode.childNodes.length > 0 && !this.currentNode.done) {
      // if the current node has childNodes that have not finished yet
      return this.currentNode.deferred.promise;
    }

    if (!this.currentNode.done) {
      // if the current node hasn't finished yet
      return err;
    }

    this.currentNode = this.currentNode.parent;

    return await this.traverse(err);
  }

  otherChildNodesInProgress(node) {
    const parentNode = node.parent;

    if (!parentNode || parentNode.isRootNode) {
      return false;
    }

    return parentNode.childNodes.filter(item => item !== node && !item.done).length > 0;
  }

  shouldRejectNodePromise(err) {
    if (err.isExpect && this.currentNode.isES6Async) {
      return true;
    }

    if (this.cucumberRunner) {
      return err.waitFor;
    }

    return this.currentNode.rejectPromise;
  }

  shouldRejectParentNodePromise(err) {
    const {parent} = this.currentNode;
    if (!parent || this.mochaRunner) {
      return false;
    }

    return err.name === 'NightwatchAssertError' && !err.isExpect && !parent.isRootNode && parent.isES6Async;
  }

  async runChildNode(node) {
    this.currentNode = node;
    this.currentNode.started = true;
    Logger.log(`\n ${Logger.colors.green('→')} Running command: ${Logger.colors.light_green(node.fullName)} (${AsyncTree.printArguments(node)})`);

    const result = await node.run();
    const {parent} = this.currentNode;

    let abortOnFailure = false;
    let err;

    if (result instanceof Error) {
      err = node.handleError(result);

      abortOnFailure = err.abortOnFailure || Utils.isUndefined(err.abortOnFailure);
      if (this.foreignRunner) {
        err.stack = err.stack.split('\n').slice(1).join('\n');
      }

      if (this.shouldRejectNodePromise(err)) {
        this.currentNode.reject(err);
      } else {
        this.currentNode.resolve(err);
      }

      if (this.shouldRejectParentNodePromise(err)) {
        parent.reject(err);
      }
    } else {
      node.resolveValue = result;
      this.resolveNode(this.currentNode, result);
    }

    Logger.log(` ${Logger.colors.green('→')} Completed command: ${Logger.colors.light_green(node.fullName)}` +
      ` (${AsyncTree.printArguments(node)}) (${node.elapsedTime}ms)`);

    if (abortOnFailure) {
      this.empty();
      this.createRootNode();
      this.returnError = err; // this is to make assertions return the proper errors
      this.emit('asynctree:finished', this);

      return err;
    }

    return await this.traverse(err);
  }

  resolveNode(node, result, times = 0) {
    if (times === 5) {
      return;
    }

    if (!node.isRootNode) {
      node.resolve(result);
    }

    setTimeout(() => {
      const stillInProgress = this.otherChildNodesInProgress(node);

      if (node.context && node.context instanceof EventEmitter) {
        node.context.emit('complete');
      }

      const isAssertion = node.parent && node.parent.namespace === 'assert';
      if (node.parent && !node.parent.isRootNode && !isAssertion && !stillInProgress) {
        node.done = true;
        this.resolveNode(node.parent, result, ++times);
      }
    }, 10);
  }

  async done(err = null) {
    this.emit('asynctree:finished', this);
    this.empty();
    this.createRootNode();

    return err;
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
          return node.redact ? '<redacted>' : `'${arg}'`;
        case 'object': {
          const keys = Object.keys(arg);

          return `{${keys.length < 10 ? keys.join(', ') : (keys.slice(0, 10).join(', ') + '...')}}`;
        }
        default:
          return arg.toString();
      }
    }).join(', ');
  }
}

module.exports = AsyncTree;
