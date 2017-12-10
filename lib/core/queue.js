const EventEmitter = require('events');
const Logger = require('./../util/logger.js');

class AsyncQueue extends EventEmitter {
  constructor() {
    super();

    this.rootNode = {
      name : '__root__',
      children : [],
      started : false,
      done : false,
      parent : this.rootNode
    };
    this.currentNode = this.rootNode;
  }

  append(nodeName, command, context, args, stackTrace) {
    let node = {
      startTime  : null,
      name       : nodeName,
      command    : command,
      context    : context,
      args       : args || [],
      started    : false,
      done       : false,
      children   : [],
      parent     : this.currentNode,
      stackTrace : stackTrace
    };

    this.currentNode.children.push(node);

    if (this.currentNode.started && !this.currentNode.done) {
      this.scheduleTraverse(node);
    }
  }

  static print(node, level) {
    process.stdout.write(node.name + '\n');
    level = level || 1;
    for (let i = 0; i < node.children.length; i++) {
      let childNode = node.children[i];
      for (let k = 0; k < level; k++) {
        process.stdout.write(' |- ');
      }

      if (childNode.children.length) {
        let levelUp = level + 1;
        arguments.callee(childNode, levelUp);
      } else {
        process.stdout.write(childNode.name + '\n');
      }
    }
    process.stdout.write('');
  }

  static getNextChild(context) {
    for (let i = 0; i < context.children.length; i++) {
      if (!context.children[i].started) {
        let child = context.children[i];
        context.children.splice(i, 1);
        return child;
      }
    }

    return false;
  }

  scheduleTraverse() {
    if (this.scheduled) {
      return this;
    }

    this.scheduled = true;

    process.nextTick(() => {
      this.scheduled = false;
      this.traverse();
    });
  }

  traverse() {
    this.emit('queue:started');
    this.currentNode.started = true;
    this.walkDown(this.currentNode);

    return this;
  }

  walkDown(context) {
    let node = AsyncQueue.getNextChild(context);
    if (node) {
      this.runChildNode(node);
    } else {
      if (context.instance && !context.done) {
        return;
      }

      this.currentNode.done = true;
      if (this.currentNode.name === '__root__') {
        this.done();
      } else {
        this.walkUp(context);
      }
    }
  }

  walkUp(context) {
    this.currentNode = context.parent;
    this.walkDown(context.parent);
  }

  runChildNode(node) {
    this.runCommand(node, () => {
      let timeMs = new Date().getTime() - node.startTime;
      // checking if new children have been added while running this command which haven't finished yet
      let childrenInProgress = false;
      let currentChildNode = null;
      for (let i = 0; i < node.children.length; i++) {
        currentChildNode = node.children[i];
        if (!currentChildNode.done) {
          childrenInProgress = true;
          break;
        }
      }

      Logger.log(`   ${Logger.colors.green('→')} Completed command ${Logger.colors.light_green(node.name)} (${timeMs}ms)`);
      node.done = true;
      if (!childrenInProgress) {
        this.traverse();
      }
    });
  }

  runCommand(node, callback) {
    this.currentNode = node;
    node.started = true;

    try {
      let commandFn = node.command;
      if (typeof node.command !== 'function') {
        // backwards compatibility
        commandFn = node.command.command;
      }

      if (typeof commandFn !== 'function') {
        throw new Error('Command must be a function');
      }

      node.startTime = new Date().getTime();
      commandFn.prototype.constructor.stackTrace = node.stackTrace;

      let instance = commandFn.apply(node.context, node.args);
      if (instance instanceof EventEmitter) {
        node.instance = instance;
        instance.once('complete', callback);
      }

      return node.context;
    } catch (err) {
      err.stack = node.stackTrace;
      err.name = 'Error while running ' + node.name + ' command';
      this.emit('error', err);

      return this;
    }
  }

  done() {
    this.rootNode.started = false;
    this.emit('queue:finished');

    return this;
  }

  empty() {
    this.rootNode.children = [];

    return this;
  }

  reset() {
    this.rootNode.started = false;
    this.rootNode.done = false;
    this.removeAllListeners();
    this.currentNode = this.rootNode;

    return this;
  }
}

module.exports = new (function() {
  let queue = new AsyncQueue();

  this.reset = function() {
    queue.reset();
  };

  this.empty = function() {
    queue.empty();
  };

  this.add = function(...args) {
    queue.append.apply(queue, args);
  };

  this.run = function queueRunner(callback) {
    if (queue.rootNode.started) {
      return queue;
    }

    if (callback) {
      queue.once('queue:finished', function() {
        callback(null);
      })
      .on('error', function(err) {
        callback(err);
      });
    }

    return queue.traverse();
  };

  this.done = function() {
    queue.done();
  };

  this.instance = function instance() {
    return queue;
  };

  this.list = function list() {
    return queue.rootNode.children.map(function(item) {
      return item.name;
    });
  };
})();
