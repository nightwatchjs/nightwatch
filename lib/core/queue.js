const EventEmitter = require('events');
const AsyncTree = require('./asynctree.js');
const Utils = require('../util/utils.js');
const Node = require('./treenode.js');

class CommandQueue extends EventEmitter {
  constructor() {
    super();

    this.isDone = false;
    this.tree = new AsyncTree();
    this.scheduleTimeoutId = null;
  }

  get currentNode() {
    return this.tree.currentNode;
  }

  get started() {
    return this.tree.rootNode.started;
  }

  shouldStartQueue() {
    const childNodes = this.currentNode.childNodes;
    const allChildNodesDone = childNodes.every(function(node) {
      return node.done;
    });

    return this.currentNode.started && allChildNodesDone;
  }

  add(nodeName, commandFn, context, args, stackTrace, namespace) {
    const node = new Node({
      name       : nodeName,
      namespace  : namespace,
      stackTrace : stackTrace,
      parent     : this.currentNode,
    });
    node.setCommand(commandFn, context, args);

    const initialChildNode = this.shouldStartQueue();

    this.tree.addNode(node);

    if (this.currentNode.done || !this.currentNode.started || initialChildNode) {
      this.scheduleTraverse(node);
    }
  }

  scheduleTraverse(node) {
    if (this.scheduleTimeoutId) {
      clearTimeout(this.scheduleTimeoutId);
    }

    this.scheduleTimeoutId = setTimeout(() => this.traverse(), 0);
  }

  clearScheduled() {
    if (this.scheduleTimeoutId) {
      clearTimeout(this.scheduleTimeoutId);
    }
  }

  empty() {
    this.tree.empty();

    return this;
  }

  reset() {
    this.tree.reset();

    return this;
  }

  traverse() {
    this.tree
      .traverse()
      .catch(err => {
        return err;
      })
      .then(err => {
        const args = [];
        if (err instanceof Error) {
          args.push(err);
        }
        this.done.apply(this, args);
      });

    return this;
  }

  done(err) {
    if (this.tree.rootNode.childNodes.length > 0) {
      return this;
    }

    this.emit('queue:finished', err);
    if (this.deferred) {
      this.deferred.resolve(err);
    }
  }

  run() {
    if (this.tree.started) {
      return this;
    }

    this.deferred = Utils.createPromise();
    this.traverse();

    return this.deferred.promise;
  }
}

module.exports = CommandQueue;
