const EventEmitter = require('events');
const AsyncTree = require('./asynctree.js');
const Node = require('./treenode.js');

class CommandQueue extends EventEmitter {
  constructor() {
    super();

    this.tree = new AsyncTree();
    this.scheduleTimeoutId = null;
  }

  get currentNode() {
    return this.tree.currentNode;
  }

  get started() {
    return this.tree.rootNode.started;
  }

  add(nodeName, commandFn, context, args, stackTrace, namespace) {
    const node = new Node({
      name       : nodeName,
      namespace  : namespace,
      stackTrace : stackTrace,
      parent     : this.currentNode,
    });
    node.setCommand(commandFn, context, args);

    this.tree.addNode(node);

    if (this.tree.inProgress) {
      this.scheduleTraverse();
    }
  }

  scheduleTraverse() {
    if (this.scheduleTimeoutId) {
      clearTimeout(this.scheduleTimeoutId);
    }

    this.scheduleTimeoutId = setTimeout(() => {
      this.tree
        .traverse()
        .catch(err => {
          return err;
        });
    }, 0);
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

  run() {
    if (this.tree.started) {
      return this;
    }

    return this.tree
      .traverse()
      .catch(err => {
        return err;
      })
      .then(err => {
        this.emit('queue:finished', err);

        return err;
      });
  }
}

module.exports = CommandQueue;
