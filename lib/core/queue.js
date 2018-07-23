const EventEmitter = require('events');
const Logger = require('./../util/logger.js');
const Utils = require('./../util/utils.js');

class AsyncQueue extends EventEmitter {
  constructor() {
    super();

    this.rootNode = {
      name : '__root__',
      childNodes : [],
      started : false,
      done : false,
      parent : this.rootNode
    };
    this.currentNode = this.rootNode;
  }

  add(nodeName, command, context, args, stackTrace) {
    let node = {
      startTime  : null,
      name       : nodeName,
      command    : command,
      context    : context,
      args       : args || [],
      started    : false,
      done       : false,
      childNodes   : [],
      parent     : this.currentNode,
      stackTrace : stackTrace
    };

    this.currentNode.childNodes.push(node);

    if (this.currentNode.started && !this.currentNode.done) {
      this.scheduleTraverse(node);
    }
  }

  static print(node, level) {
    process.stdout.write(node.name + '\n');
    level = level || 1;
    for (let i = 0; i < node.childNodes.length; i++) {
      let childNode = node.childNodes[i];
      for (let k = 0; k < level; k++) {
        process.stdout.write(' |- ');
      }

      if (childNode.childNodes.length) {
        let levelUp = level + 1;
        arguments.callee(childNode, levelUp);
      } else {
        process.stdout.write(childNode.name + '\n');
      }
    }
    process.stdout.write('');
  }

  static getNextChild(context) {
    for (let i = 0; i < context.childNodes.length; i++) {
      if (!context.childNodes[i].started) {
        let child = context.childNodes[i];
        context.childNodes.splice(i, 1);
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
        if (Utils.isFunction(context.instance.complete)) {
          context.instance.complete();
        }
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
    this.runCommand(node, result => {
      let timeMs = new Date().getTime() - node.startTime;
      // checking if new child nodes have been added while running this command which haven't finished yet
      let childNodesInProcess = false;
      let currentChildNode = null;

      for (let i = 0; i < node.childNodes.length; i++) {
        currentChildNode = node.childNodes[i];
        if (!currentChildNode.done) {
          childNodesInProcess = true;
          break;
        }
      }

      Logger.log(`${Logger.colors.green('→')} Completed command ${Logger.colors.light_green(node.name)} (${timeMs}ms)`);
      node.done = true;

      if (!childNodesInProcess) {
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
      if (Logger.isEnabled()) {
        console.log('');
      }

      Logger.log(`${Logger.colors.green('→')} Running command: ${Logger.colors.light_green(node.name)}`);
      if (commandFn.prototype) {
        commandFn.prototype.constructor.stackTrace = node.stackTrace;
      }

      let instance = commandFn.apply(node.context, node.args);

      if (!commandFn.prototype) {
        instance.stackTrace = node.stackTrace;
      }

      this.handleCommandResult(instance, node)
        .then(result => {
          callback(result);
        })
        .catch(err => {
          err.abortOnFailure = err.abortOnFailure || err.abortOnFailure === undefined;

          if (err.abortOnFailure) {
            this.emit('error', err);
          } else {
            callback(err);
          }

        });
    } catch (err) {
      let originalError = err.stack;

      if (node.stackTrace) {
        err.stack = node.stackTrace;
      }

      err.message = `Error while running "${node.name}" command: "${originalError.split('\n')[0]}"`;

      this.emit('error', err);
    }

    return this;
  }

  handleCommandResult(instance, node) {
    if (instance instanceof Promise) {
      return instance;
    }

    let commandResult;

    if (instance instanceof EventEmitter) {
      node.instance = commandResult = instance;
    } else if (node.context instanceof EventEmitter) { // Chai assertions
      commandResult = node.context;
    }

    if (!commandResult) {
      throw new Error('Commands must either return an EventEmitter which emits a "complete" event or a Promise.');
    }

    let resolveFn;
    let rejectFn;

    commandResult
      .once('complete', function(resolve) {
        resolveFn(resolve);
      })
      .once('error', (err, abortOnFailure) => {
        err.abortOnFailure = abortOnFailure || abortOnFailure === undefined;
        rejectFn(err);
      });

    return new Promise((resolve, reject) => {
      resolveFn = resolve;
      rejectFn = reject;
    });
  }

  done() {
    this.rootNode.started = false;
    this.emit('queue:finished');

    return this;
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

  list() {
    return this.rootNode.childNodes.map(function(item) {
      return item.name;
    });
  }

  run(callback) {
    if (this.rootNode.started) {
      return this;
    }

    if (callback) {
      this.once('queue:finished', function() {
        callback(null);
      })
        .once('error', callback);
    }

    return this.traverse();
  }
}

module.exports = AsyncQueue;
