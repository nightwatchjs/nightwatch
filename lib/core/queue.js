var util = require('util');
var events = require('events');
var Logger = require('./../util/logger.js');

function AsyncTree() {
  events.EventEmitter.call(this);
  this.rootNode = {
    name : '__root__',
    children : [],
    started : false,
    done : false,
    parent : this.rootNode
  };
  this.currentNode = this.rootNode;
}
util.inherits(AsyncTree, events.EventEmitter);

AsyncTree.prototype.append = function(nodeName, command, context, args, stackTrace) {
  var node = {
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
};

AsyncTree.prototype.print = function(node, level) {
  process.stdout.write(node.name + '\n');
  level = level || 1;
  for (var i = 0; i < node.children.length; i++) {
    var childNode = node.children[i];
    for (var k = 0; k < level; k++) {
      process.stdout.write(' |- ');
    }
    if (childNode.children.length) {
      var levelUp = level + 1;
      arguments.callee(childNode, levelUp);
    } else {
      process.stdout.write(childNode.name + '\n');
    }
  }
  process.stdout.write('');
};

AsyncTree.prototype.scheduleTraverse = function(node) {
  if (this.scheduled) {
    return this;
  }
  this.scheduled = true;
  var self = this;
  process.nextTick(function() {
    self.scheduled = false;
    self.traverse();
  });
};

AsyncTree.prototype.traverse = function() {
  this.emit('queue:started');

  try {
    this.walkDown(this.currentNode);
  } catch (err) {
    console.log(err.stack);
  }

  this.currentNode.started = true;
  return this;
};

AsyncTree.prototype.walkDown = function walkDown(context) {
  var node = this.getNextChild(context);
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
};

AsyncTree.prototype.walkUp = function(context) {
  this.currentNode = context.parent;
  this.walkDown(context.parent);
};

AsyncTree.prototype.getNextChild = function(context) {
  for (var i = 0; i < context.children.length; i++) {
    if (!context.children[i].started) {
      var child = context.children[i];
      context.children.splice(i, 1);
      return child;
    }
  }
  return false;
};

AsyncTree.prototype.runChildNode = function runChildNode(node) {
  var self = this;

  this.runCommand(node, function onCommandComplete() {
    var timems = new Date().getTime() - node.startTime;
    // checking if new children have been added while running this command which haven't finished yet
    var childrenInProgress = false;
    var currentChildNode = null;
    for (var i = 0; i < node.children.length; i++) {
      currentChildNode = node.children[i];
      if (!currentChildNode.done) {
        childrenInProgress = true;
        break;
      }
    }

    Logger.log('   ' + Logger.colors.green('→') +
      ' Completed command ' + Logger.colors.light_green(node.name), '(' + timems,  'ms)');
    node.done = true;
    if (!childrenInProgress) {
      self.traverse();
    }
  });
};

AsyncTree.prototype.runCommand = function(node, callback) {
  this.currentNode = node;
  node.started = true;

  try {
    var commandFn = node.command;
    if (typeof node.command !== 'function') {
      // backwards compatibility
      commandFn = node.command.command;
    }

    if (typeof commandFn !== 'function') {
      throw new Error('Command must be a function');
    }

    node.startTime = new Date().getTime();
    commandFn.prototype.constructor.stackTrace = node.stackTrace;

    var instance = commandFn.apply(node.context, node.args);
    if (instance instanceof events.EventEmitter) {
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
};

AsyncTree.prototype.done = function() {
  this.rootNode.started = false;
  this.emit('queue:finished');
  return this;
};

AsyncTree.prototype.empty = function() {
  this.rootNode.children = [];
  return this;
};

AsyncTree.prototype.reset = function() {
  this.rootNode.started = false;
  this.rootNode.done = false;
  this.removeAllListeners();
  this.currentNode = this.rootNode;
  return this;
};

module.exports = new (function() {
  var queue = new AsyncTree();

  this.reset = function() {
    queue.reset();
  };

  this.empty = function() {
    queue.empty();
  };

  this.add = function() {
    queue.append.apply(queue, arguments);
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
