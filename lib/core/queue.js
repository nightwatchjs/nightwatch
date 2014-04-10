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

AsyncTree.prototype.append = function(nodeName, command, context, args, reset) {
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
    reset      : reset || false
  };
  this.currentNode.children.push(node);
  if (this.currentNode.started && !this.currentNode.done && !this.currentNode.reset) {
    this.scheduleTraverse();
  }
};

AsyncTree.prototype.walkDown = function walkDown(context) {
  var self = this;
  var node = this.getNextChild(context);
  if (node) {
    this.currentNode = node;
    this.runCommand(node, function onCommandComplete(command) {
      var timems = new Date().getTime() - node.startTime;
      Logger.log('   ' + Logger.colors.green('→') +
        ' Completed command ' + Logger.colors.light_green(node.name), '(' + timems,  'ms)');

      // checking if new children have been added while running this command which haven't finished yet
      var childrenInProgress = false;
      for (var i = 0; i < node.children.length; i++) {
        if (!node.children[i].done) {
          childrenInProgress = true;
        }
      }

      if (!childrenInProgress) {
        self.traverse();
      }
    });
  } else {
    context.done = true;
    if (this.currentNode.name === '__root__') {
      this.done();
    } else {
      this.walkUp(context);
    }
  }
};

AsyncTree.prototype.walkUp = function(context) {
  this.currentNode = context.parent;
  context.done = true;
  this.walkDown(context.parent);
};

AsyncTree.prototype.getNextChild = function(context) {
  for (var i = 0; i < context.children.length; i++) {
    if (!context.children[i].started) {
      return context.children[i];
    }
  }
  return false;
};

AsyncTree.prototype.runCommand = function(node, callback) {
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
    var emitter = commandFn.apply(node.context, node.args);
    if (emitter instanceof events.EventEmitter) {
      emitter.once('complete', callback);
    } else if (this.currentNode.reset) {
      this.traverse();
    }
    return node.context;
  } catch (err) {
    err.name = 'Error while running ' + node.name + ' command';
    this.emit('error', err);
    return this;
  }
};

AsyncTree.prototype.done = function() {
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

AsyncTree.prototype.scheduleTraverse = function() {
  if (this.scheduled) {
    return;
  }
  this.scheduled = true;
  var self = this;
  process.nextTick(function() {
    self.traverse();
    self.scheduled = false;
  });
};

AsyncTree.prototype.traverse = function() {
  try {
    this.walkDown(this.currentNode);
  } catch (err) {
    console.log(err.stack);
  }

  this.currentNode.started = true;
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

  this.getSkipped = function() {
    var items = queue.rootNode.children.filter(function(item) {
      return !item.started;
    });
    return items.length;
  };

  this.list = function list() {
    return queue.rootNode.children.map(function(item) {
      return item.name;
    });
  };
})();
