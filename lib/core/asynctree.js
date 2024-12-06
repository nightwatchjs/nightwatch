const EventEmitter = require('events');
const Utils = require('../utils');
const TreeNode = require('./treenode.js');
const {Logger} = Utils;
const Debuggability = require('../utils/debuggability.js');


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

  constructor({compatMode, foreignRunner, cucumberRunner, mochaRunner, skip_testcase_on_fail = true}) {
  super();
  this.compatMode = compatMode;
  this.foreignRunner = foreignRunner;
  this.cucumberRunner = cucumberRunner;
  this.mochaRunner = mochaRunner;
  this.skip_testcase_on_fail = skip_testcase_on_fail; // Define the flag
  this.createRootNode();
  this.returnError = null;
  this.skipRemainingTests = false; // New flag to track skipping
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
    if (this.skipRemainingTests) {
    return; // Stop traversal if skipping is enabled
  }

  this.rootNode.started = true;
  const childNode = AsyncTree.getNextChildNode(this.currentNode);

  if (childNode) {
    const result = await this.runChildNode(childNode);

    if (result instanceof Error && result.namespace === 'verify') {
      return null;
    }

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

  shouldAvoidParentNodeResolution(node) {
    const parentNode = node.parent;

    if (!parentNode || parentNode.isRootNode) {
      return true;
    }

    const result = parentNode.options?.avoidPrematureParentNodeResolution;

    return Boolean(result);
  }

  shouldRejectNodePromise(err, abortOnFailure, node = this.currentNode) {
    const rejectNodeOnAbortFailure = node.options?.rejectNodeOnAbortFailure;

    if ((err.isExpect || node.namespace === 'assert' || (abortOnFailure && rejectNodeOnAbortFailure)) && this.currentNode.isES6Async) {
      return true;
    }

    if (this.cucumberRunner) {
      return err.waitFor;
    }

    return node.rejectPromise || err.rejectPromise;
  }

  shouldRejectParentNodePromise(err, node = this.currentNode) {
     const { parent } = node;
  if (!parent || this.mochaRunner) {
    return false;
  }

  // Adjust this logic to include NightwatchAssertError based on your requirements
  return parent.isES6Async && (err.name === 'NightwatchAssertError' || !err.isExpect) && !parent.isRootNode;
  }

  async runChildNode(node) {
    this.currentNode = node;
  this.currentNode.started = true;
  
  // Skip remaining tests if the flag is set
  if (this.skipRemainingTests) {
    return;
  }

  Logger.log(`\n ${Logger.colors.green('→')} Running command: ${Logger.colors.green(node.fullName)}${AsyncTree.printArguments(node)}`);

  this.emit('asynctree:command:start', {node});

  const result = await node.run();
  const {parent} = this.currentNode;

  let abortOnFailure = false;
  let err;

  if (result instanceof Error) {
    err = node.handleError(result);
    err.namespace = node.namespace;

    abortOnFailure = err.abortOnFailure || Utils.isUndefined(err.abortOnFailure);
    
    if (this.foreignRunner) {
      err.stack = err.stack.split('\n').slice(1).join('\n');
    }

    if (this.shouldRejectNodePromise(err, abortOnFailure, node)) {
      node.reject(err);
    } else {
      node.resolve(err);
    }

    if (this.shouldRejectParentNodePromise(err, node)) {
      parent.reject(err);
    }

    // Set the flag to skip remaining tests if skip_testcase_on_fail is true
    if (this.shouldSkipTestCaseOnFail(err)) {
      this.skipRemainingTests = true;

       // Log the status of skipRemainingTests flag
  Logger.log(`skipRemainingTests set to: ${this.skipRemainingTests}`);

    }

  } else {
    node.resolveValue = result;
    this.resolveNode(node, result);
  }

  Logger.log(`${Logger.colors.green('→')} Completed command: ${Logger.colors.green(node.fullName)}` +
    `${AsyncTree.printArguments(node)} (${node.elapsedTime}ms)`);

  this.emit('asynctree:command:finished', {node, result});

  if (abortOnFailure) {
    this.empty();
    this.createRootNode();
    this.returnError = err;
    this.emit('asynctree:finished', this);

    return err;
  }

  if (Debuggability.stepOverAndPause && node.parent.isRootNode && node.fullName !== 'pause') {
    this.currentNode.context.api.pause();
    Debuggability.stepOverAndPause = false;
  }

  return await this.traverse(err);
  }

  shouldSkipTestCaseOnFail(err) {
  // Assuming skip_testcase_on_fail is stored in the test configuration/settings
  return this.skip_testcase_on_fail && err;
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
      const avoidPrematureParentNodeResolution = this.shouldAvoidParentNodeResolution(node);

      if (node.context && node.context instanceof EventEmitter) {
        node.context.emit('complete');
      }

      const isAssertion = node.parent && (node.parent.namespace === 'assert' || node.parent.namespace === 'verify');
      if (node.parent && !node.parent.isRootNode && !isAssertion && !stillInProgress && !avoidPrematureParentNodeResolution) {
        node.done = true;
        this.resolveNode(node.parent, result, ++times);
      }
    }, 10);
  }

  async done(err = null) {
    this.emit('asynctree:finished', this);
    this.empty();
    this.createRootNode();

    // Test case is complete, reset Debuggability properties.
    Debuggability.reset();

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

    const argsContent = args.map(function(arg) {
      if (arg === null || arg === undefined) {
        return arg;
      }

      switch (typeof arg) {
        case 'function':
          return '[Function]';
        case 'string':
          return node.redact ? '**********' : `'${arg}'`;
        case 'object': {
          if (node.printArgs) {
            return node.printArgs();
          }

          const keys = Object.keys(arg);

          return `{${keys.length < 10 ? keys.join(', ') : (keys.slice(0, 10).join(', ') + '...')}}`;
        }
        default:
          return arg.toString();
      }
    }).join(', ');

    return Logger.colors.cyan(` (${argsContent})`);
  }
}

module.exports = AsyncTree;
