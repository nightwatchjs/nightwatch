const Logger = require('../util/logger.js');
const TreeNode = require('./treenode.js');
const Utils = require('../util/utils.js');

class AsyncTree {
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
    const childNode = AsyncTree.getNextChild(this.currentNode);

    if (childNode) {
      return this.runChildNode(childNode).then(result => {
        let abortOnFailure = false;
        if (result instanceof Error) {
          abortOnFailure = result.abortOnFailure || Utils.isUndefined(result.abortOnFailure);
        }

        if (abortOnFailure) {
          return this.done(result);
        }

        return this.traverse();
      });
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
      return new Promise((resolve, reject) => {
        this.currentNode.result
          .then(_=> resolve())
          .catch(err => reject(err));
      });
    }

    if (!this.currentNode.done) {
      // if the current node hasn't finished yet
      return new Promise((resolve, reject) => {
        this.currentNode.result
          .then(_=> resolve())
          .catch(err => reject(err));
      }).then(_ => this.walkUp());
    }

    this.currentNode = this.currentNode.parent;

    return this.traverse();
  }

  runChildNode(node) {
    this.currentNode = node;
    this.currentNode.started = true;
    Logger.log(`\n ${Logger.colors.green('→')} Running command: ${Logger.colors.light_green(node.name)} (${AsyncTree.printArguments(node)})`);

    return node.run()
      .then(result => {
        Logger.log(`${Logger.colors.green('→')} Completed command ${Logger.colors.light_green(node.name)}` +
          ` (${AsyncTree.printArguments(node)}) (${node.elapsedTime}ms)`);

        return result;
      })
      .catch(err => {
        return err;
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
    this.empty();
    this.createRootNode();

    return Promise.resolve(err);
  }

  ///////////////////////////////////////////////////////////////////////////
  // STATIC
  ///////////////////////////////////////////////////////////////////////////
  static getNextChild(node) {
    for (let i = 0; i < node.childNodes.length; i++) {
      if (!node.childNodes[i].started) {
        return node.childNodes[i];
      }
    }

    return false;
  }

  static printArguments(node) {
    return node.args.map(function(arg) {
      if (arg === null || arg === undefined) {
        return arg;
      }

      switch (typeof arg) {
        case 'function':
          return '[Function]';
        case 'string':
          return `'${arg}'`;
        case 'object':
          return `{${Object.keys(arg).join(', ')}`;
        default:
          return arg.toString();
      }
    }).join(', ');
  }
}

module.exports = AsyncTree;