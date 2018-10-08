const EventEmitter = require('events');
const Logger = require('./../util/logger.js');
const Utils = require('./../util/utils.js');

class CommandQueue extends EventEmitter {
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

  static printArguments(args) {
    return args.map(function(arg) {
      if (arg === null || arg === undefined) {
        return arg;
      }

      switch (typeof arg) {
        case 'function':
          return '[Function]';
        case 'string':
          return `'${arg}'`;
        default:
          return arg.toString();
      }
    }).join(', ');
  }

  static getNextChild(context) {
    for (let i = 0; i < context.childNodes.length; i++) {
      if (!context.childNodes[i].started) {
        return context.childNodes[i];
      }
    }

    return false;
  }

  constructor() {
    super();

    this.scheduleTimeoutId = null;

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

  scheduleTraverse(node) {
    if (this.scheduled) {
      return this;
    }

    this.scheduled = true;

    this.scheduleTimeoutId = setTimeout(() => {
      this.traverse();
      this.scheduled = false;
    }, 0);
  }

  traverse() {
    this.emit('queue:started');
    this.currentNode.started = true;
    this.walkDown(this.currentNode);

    return this;
  }

  walkDown(node) {
    const childNode = CommandQueue.getNextChild(node);

    if (childNode) {
      this.runChildNode(childNode);

      return;
    }

    if (node.instance && !node.done && Utils.isFunction(node.instance.complete)) {
      setImmediate(() => {
        node.instance.complete();
      });

      return;
    }

    node.done = true;
    if (node.name === '__root__') {
      this.done();
    } else {
      this.walkUp(node);
    }
  }

  walkUp(node) {
    this.currentNode = node.parent;
    this.walkDown(node.parent);
  }

  runChildNode(node) {
    this.runCommand(node, (result, nodeResult) => {
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

      Logger.log(`${Logger.colors.green('→')} Completed command ${Logger.colors.light_green(node.name)} (${CommandQueue.printArguments(node.args)}) (${timeMs}ms)`);
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

      Logger.log(`${Logger.colors.green('→')} Running command: ${Logger.colors.light_green(node.name)} (${CommandQueue.printArguments(node.args)})`);

      if (commandFn.prototype) {
        commandFn.prototype.constructor.stackTrace = node.stackTrace;
      }

      const instance = commandFn.apply(node.context, node.args);

      if (!commandFn.prototype) {
        instance.stackTrace = node.stackTrace;
      }

      const result = (instance instanceof Promise) ? instance : this.handleCommandResult(instance, node);

      result
        .then(result => {

          callback(result, node);
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
    let commandResult;

    if (instance instanceof EventEmitter) {
      node.instance = commandResult = instance;
    } else if (node.context instanceof EventEmitter) { // Chai assertions
      commandResult = node.context;
    }

    if (!commandResult) {
      throw new Error('Commands must either return an EventEmitter which emits a "complete" event or a Promise.');
    }

    return new Promise((resolve, reject) => {
      commandResult
        .once('complete', (result) => resolve(result))
        .once('error', (err, abortOnFailure) => {
          err.message = `Error while running "${node.name}" command: ${err.message}`;
          err.abortOnFailure = abortOnFailure || abortOnFailure === undefined;
          reject(err);
        });
    });
  }

  done() {
    this.rootNode.started = false;
    this.emit('queue:finished');

    return this;
  }

  clearScheduled() {
    if (this.scheduleTimeoutId) {
      this.scheduled = false;
      clearTimeout(this.scheduleTimeoutId);
    }
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
      this.once('queue:finished', () => callback(null))
        .once('error', callback);
    }

    return this.traverse();
  }
}

module.exports = CommandQueue;
